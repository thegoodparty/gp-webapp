'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  buildRangeIn,
  findAnchorEl,
  pointToOffset,
  type ResolvedAnchor,
} from '@shared/briefings/anchorResolver'
import {
  annotationsQueryKey,
  useAnnotations,
} from '@shared/briefings/use-annotations'
import { useSelection } from '@shared/briefings/use-selection'
import type { Annotation, AnnotationAnchor } from '@shared/briefings/types'
import HighlightToolbar from './HighlightToolbar'
import AddNoteSheet from './AddNoteSheet'
import ReportErrorSheet from './ReportErrorSheet'
import AnnotationsHighlightLayer from './AnnotationsHighlightLayer'
import AskAiSheet from './AskAiSheet'
import AddNotesDialog from '../notes-intake/AddNotesDialog'
import { uploadAttachment } from '@shared/briefings/attachments-api'

/**
 * Either an in-progress selection-driven anchor, or null for a top-level
 * (page-scoped) annotation.
 */
export type PendingAnchor = ResolvedAnchor | null

/**
 * Reconstruct the highlighted text from an annotation's jsonPath/start/end
 * by walking the live DOM. The server schema does not store the original
 * quote, so we resolve it here at open-time. Returns an empty object when
 * the annotation lacks a usable anchor or the DOM no longer matches.
 */
function resolveAnnotationQuote(annotation: Annotation): {
  quote?: string
  anchor?: { jsonPath: string; start: number; end: number }
} {
  if (typeof document === 'undefined') return {}
  const { jsonPath, start, end } = annotation
  if (jsonPath === null || start === null || end === null) return {}
  const el = findAnchorEl(jsonPath)
  if (!el) return {}
  const range = buildRangeIn(el, start, end)
  if (!range) return {}
  const quote = range.toString().trim()
  if (!quote) return {}
  return { quote, anchor: { jsonPath, start, end } }
}

/**
 * Overlay state — covers both Sheet-based overlays (notes / bug reports)
 * and Popover-based overlays (Ask AI). One overlay is open at a time.
 */
export type OverlayState =
  | { kind: 'closed' }
  | { kind: 'add_note_new'; anchor: PendingAnchor }
  | { kind: 'add_note_edit'; annotation: Annotation }
  | { kind: 'report_error_new'; anchor: PendingAnchor }
  | { kind: 'report_error_view'; annotation: Annotation }
  | { kind: 'ask_ai_top_level' }
  | { kind: 'ask_ai_anchored'; anchor: ResolvedAnchor }
  | {
      kind: 'ask_ai_existing'
      annotationId: string
      quote?: string
      anchor?: { jsonPath: string; start: number; end: number }
    }

/**
 * Legacy alias retained for external imports — overlays now include
 * popovers as well as sheets, but the type name is preserved to avoid a
 * cross-file rename.
 */
export type SheetState = OverlayState

type Ctx = {
  meetingDate: string
  openAddNoteFromSelection: () => void
  openAddNoteTopLevel: () => void
  openReportErrorFromSelection: () => void
  openEditNote: (annotation: Annotation) => void
  openViewReport: (annotation: Annotation) => void
  openAskAiTopLevel: () => void
  openAskAiFromSelection: () => void
  openAskAiForAnnotation: (annotation: Annotation) => void
  closeSheet: () => void
  /**
   * Invalidates the annotations React Query cache after a chat annotation
   * is created server-side via `POST /v1/briefing-chats`. Chat creation
   * doesn't go through `useAnnotations.create`, so the list won't refetch
   * unless we invalidate manually. Top-level Ask AI surfaces
   * (AskAiPopover) and the right-side AskAiSheet both call this.
   */
  onChatCreated: (info: {
    annotationId: string
    conversationId: string
    anchor: AnnotationAnchor | null
  }) => void
}

const AnnotationsCtx = createContext<Ctx | null>(null)

export function useAnnotationsCtx(): Ctx {
  const ctx = useContext(AnnotationsCtx)
  if (!ctx) throw new Error('useAnnotationsCtx outside <AnnotationsScope>')
  return ctx
}

type Props = {
  /**
   * The briefing's meeting date (YYYY-MM-DD), used to address the briefing
   * on the API. Matches the slug in the briefing detail URL and the
   * `:date` param in the meeting briefing endpoints.
   */
  meetingDate: string
  children: React.ReactNode
}

function anchorPayload(anchor: PendingAnchor): AnnotationAnchor {
  if (!anchor) return { jsonPath: null, start: null, end: null }
  return { jsonPath: anchor.jsonPath, start: anchor.start, end: anchor.end }
}

/**
 * Wraps the briefing detail content in the annotations layer. Renders:
 *  - The HighlightToolbar (anchored to the live selection)
 *  - The AnnotationsHighlightLayer (persistent backgrounds for existing notes)
 *  - The AddNoteSheet, ReportErrorSheet, and AskAiSheet (single instances)
 *
 * The top-of-page Ask AI Popover is owned by DetailHeaderActions / the
 * mobile bottom bar — selection-spawned and existing-chat overlays open
 * the right-side AskAiSheet instead.
 *
 * Also handles click-to-open: clicking inside an existing highlight opens
 * the corresponding annotation's overlay.
 */
export default function AnnotationsScope({
  meetingDate,
  children,
}: Props): React.JSX.Element {
  const liveAnchor = useSelection()
  const queryClient = useQueryClient()
  const { annotations, create, updateNote, remove } =
    useAnnotations(meetingDate)
  const [overlay, setOverlay] = useState<OverlayState>({ kind: 'closed' })
  const [intakeOpen, setIntakeOpen] = useState(false)

  const handleChatCreated = useCallback(
    (_info: {
      annotationId: string
      conversationId: string
      anchor: AnnotationAnchor | null
    }) => {
      queryClient.invalidateQueries({
        queryKey: annotationsQueryKey(meetingDate),
      })
    },
    [queryClient, meetingDate],
  )

  const openAddNoteFromSelection = useCallback(() => {
    setOverlay({ kind: 'add_note_new', anchor: liveAnchor })
  }, [liveAnchor])

  // The top-level "Add notes" button on the header / mobile bar opens the new
  // intake dialog (camera / upload / type). Phase 1 only wires the type path;
  // camera and upload render as Coming soon.
  const openAddNoteTopLevel = useCallback(() => {
    setIntakeOpen(true)
  }, [])

  const openReportErrorFromSelection = useCallback(() => {
    setOverlay({ kind: 'report_error_new', anchor: liveAnchor })
  }, [liveAnchor])

  const openEditNote = useCallback((annotation: Annotation) => {
    setOverlay({ kind: 'add_note_edit', annotation })
  }, [])

  const openViewReport = useCallback((annotation: Annotation) => {
    setOverlay({ kind: 'report_error_view', annotation })
  }, [])

  // Top-level Ask AI is anchored to the header button's own Popover (see
  // DetailHeaderActions / MobileBottomBar); the overlay state covers
  // selection-spawned chats and re-opens of existing chat annotations only.
  const openAskAiTopLevel = useCallback(() => {
    setOverlay({ kind: 'ask_ai_top_level' })
  }, [])

  const openAskAiFromSelection = useCallback(() => {
    if (!liveAnchor) {
      setOverlay({ kind: 'ask_ai_top_level' })
      return
    }
    setOverlay({ kind: 'ask_ai_anchored', anchor: liveAnchor })
  }, [liveAnchor])

  const openAskAiForAnnotation = useCallback((annotation: Annotation) => {
    if (annotation.kind !== 'chat' || !annotation.chat) return
    setOverlay({
      kind: 'ask_ai_existing',
      annotationId: annotation.id,
      ...resolveAnnotationQuote(annotation),
    })
  }, [])

  const closeSheet = useCallback(() => {
    setOverlay({ kind: 'closed' })
  }, [])

  // Click-to-open: if the user clicks (collapsed mouseup) inside a region
  // covered by an existing annotation, open that annotation's overlay.
  useEffect(() => {
    if (typeof window === 'undefined') return

    function openAnnotation(ann: Annotation) {
      if (ann.kind === 'note') {
        setOverlay({ kind: 'add_note_edit', annotation: ann })
      } else if (ann.kind === 'bug_report') {
        setOverlay({ kind: 'report_error_view', annotation: ann })
      } else if (ann.kind === 'chat') {
        setOverlay({
          kind: 'ask_ai_existing',
          annotationId: ann.id,
          ...resolveAnnotationQuote(ann),
        })
      }
    }

    function onClick(e: MouseEvent) {
      // Don't intercept drag-to-select: only handle plain clicks.
      const sel = window.getSelection()
      if (sel && !sel.isCollapsed && sel.toString().length > 0) return

      const target = e.target as HTMLElement | null
      if (!target) return

      // The bug-icon overlay lives outside the briefing content. Match it
      // first so clicks on the icon open the matching report sheet.
      const bugMarker = target.closest(
        '.briefing-bug-marker[data-annotation-id]',
      ) as HTMLElement | null
      if (bugMarker) {
        const id = bugMarker.dataset.annotationId
        const ann = id ? annotations.find((a) => a.id === id) : null
        if (ann) {
          openAnnotation(ann)
          e.preventDefault()
        }
        return
      }

      // Don't trigger from clicks on links, buttons, or other interactive
      // elements rendered inside the briefing content.
      if (target.closest('a, button, [role=button], input, textarea, select')) {
        return
      }

      const hit = pointToOffset(e.clientX, e.clientY)
      if (!hit) return

      for (const ann of annotations) {
        if (ann.jsonPath !== hit.jsonPath) continue
        if (ann.start === null || ann.end === null) continue
        if (hit.offset < ann.start || hit.offset >= ann.end) continue
        openAnnotation(ann)
        e.preventDefault()
        return
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [annotations])

  const ctxValue: Ctx = useMemo(
    () => ({
      meetingDate,
      openAddNoteFromSelection,
      openAddNoteTopLevel,
      openReportErrorFromSelection,
      openEditNote,
      openViewReport,
      openAskAiTopLevel,
      openAskAiFromSelection,
      openAskAiForAnnotation,
      closeSheet,
      onChatCreated: handleChatCreated,
    }),
    [
      meetingDate,
      openAddNoteFromSelection,
      openAddNoteTopLevel,
      openReportErrorFromSelection,
      openEditNote,
      openViewReport,
      openAskAiTopLevel,
      openAskAiFromSelection,
      openAskAiForAnnotation,
      closeSheet,
      handleChatCreated,
    ],
  )

  const askAiSheetOpen =
    overlay.kind === 'ask_ai_anchored' || overlay.kind === 'ask_ai_existing'

  return (
    <AnnotationsCtx.Provider value={ctxValue}>
      {children}
      <AnnotationsHighlightLayer annotations={annotations} />
      <HighlightToolbar
        anchor={liveAnchor}
        onAddNote={openAddNoteFromSelection}
        onReportError={openReportErrorFromSelection}
        onAskAi={openAskAiFromSelection}
      />
      {(overlay.kind === 'add_note_new' ||
        overlay.kind === 'add_note_edit') && (
        <AddNoteSheet
          sheet={overlay}
          onClose={closeSheet}
          onCreate={async (anchor, body) => {
            await create.mutateAsync({
              kind: 'note',
              anchor: anchorPayload(anchor),
              payload: { body },
            })
            window.getSelection()?.removeAllRanges()
          }}
          onUpdate={async (id, body) => {
            await updateNote.mutateAsync({ id, body })
          }}
          onDelete={async (id) => {
            await remove.mutateAsync(id)
          }}
        />
      )}
      {(overlay.kind === 'report_error_new' ||
        overlay.kind === 'report_error_view') && (
        <ReportErrorSheet
          sheet={overlay}
          onClose={closeSheet}
          onCreate={async (anchor, description) => {
            await create.mutateAsync({
              kind: 'bug_report',
              anchor: anchorPayload(anchor),
              payload: { description },
            })
            window.getSelection()?.removeAllRanges()
          }}
          onDelete={async (id) => {
            await remove.mutateAsync(id)
          }}
        />
      )}
      {askAiSheetOpen && (
        <AskAiSheet
          sheet={overlay}
          meetingDate={meetingDate}
          onClose={closeSheet}
          onChatCreated={handleChatCreated}
        />
      )}
      <AddNotesDialog
        open={intakeOpen}
        onClose={() => setIntakeOpen(false)}
        onSubmit={async (input) => {
          if (input.kind === 'typed') {
            await create.mutateAsync({
              kind: 'note',
              anchor: { jsonPath: null, start: null, end: null },
              payload: { body: input.body },
            })
            return
          }
          // File path: create the note row first (no body), then PUT to S3
          // via presign + complete. The polled annotations list picks up the
          // OCR status updates afterwards.
          const created = await create.mutateAsync({
            kind: 'note',
            anchor: { jsonPath: null, start: null, end: null },
            payload: {},
          })
          await uploadAttachment({
            annotationId: created.id,
            file: input.file,
          })
          queryClient.invalidateQueries({
            queryKey: annotationsQueryKey(meetingDate),
          })
        }}
      />
    </AnnotationsCtx.Provider>
  )
}
