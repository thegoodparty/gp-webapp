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
import {
  deleteAttachment,
  uploadAttachment,
} from '@shared/briefings/attachments-api'

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
  /**
   * Id of the user's existing top-level chat annotation on this briefing,
   * if any. Passed to AskAiSheet so a top-level reopen skips
   * `createBriefingChat` and loads prior messages directly. Undefined when
   * no top-level chat exists yet — first open will mint one.
   */
  topLevelChatAnnotationId?: string
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
   * unless we invalidate manually. AskAiSheet calls this for all three
   * Ask AI entry points (top-level, anchored, existing).
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
 * All three Ask AI entry points (top-of-page button, selection action, and
 * re-opening an existing chat highlight) open the same right-side AskAiSheet
 * via the overlay state.
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

  // The top-level "Add notes" button on the header / mobile bar opens the
  // same AddNoteSheet used for anchored notes — just with `anchor: null`,
  // so the note is scoped to the whole briefing rather than a passage.
  const openAddNoteTopLevel = useCallback(() => {
    setOverlay({ kind: 'add_note_new', anchor: null })
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

      // Marker icons (note / chat / bug) are inline DOM nodes inserted at
      // the end of each annotation's range. Pointer hits on them should
      // open the matching annotation overlay; pointToOffset can't see them
      // because they're outside the briefing's text run.
      const marker = target.closest(
        '.briefing-note-marker[data-annotation-id], .briefing-chat-marker[data-annotation-id], .briefing-bug-marker[data-annotation-id]',
      ) as HTMLElement | null
      if (marker) {
        const id = marker.dataset.annotationId
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

  const topLevelChatAnnotationId = useMemo(
    () => annotations.find((a) => a.kind === 'chat' && a.jsonPath === null)?.id,
    [annotations],
  )

  const ctxValue: Ctx = useMemo(
    () => ({
      meetingDate,
      topLevelChatAnnotationId,
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
      topLevelChatAnnotationId,
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
    overlay.kind === 'ask_ai_anchored' ||
    overlay.kind === 'ask_ai_existing' ||
    overlay.kind === 'ask_ai_top_level'

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
          onCreate={async (anchor, body, attachments) => {
            const created = await create.mutateAsync({
              kind: 'note',
              anchor: anchorPayload(anchor),
              payload: { body },
            })
            window.getSelection()?.removeAllRanges()
            // Upload any staged attachments against the freshly created
            // annotation. Run serially to keep retry behaviour predictable.
            // Failures don't roll back the note — the body is already on
            // the server and worth keeping; the user can retry uploads
            // separately if we surface that path later.
            for (const a of attachments) {
              try {
                await uploadAttachment({
                  annotationId: created.id,
                  file: a.file,
                })
              } catch {
                /* swallow per-file failure; let the React Query refetch
                   below sync server state. We'll wire surfaced errors in
                   a follow-up. */
              }
            }
            if (attachments.length > 0) {
              queryClient.invalidateQueries({
                queryKey: annotationsQueryKey(meetingDate),
              })
            }
          }}
          onUpdate={async (id, body) => {
            await updateNote.mutateAsync({ id, body })
          }}
          onDelete={async (id) => {
            await remove.mutateAsync(id)
          }}
          onAttachmentAdd={async (annotationId, file) => {
            await uploadAttachment({ annotationId, file })
            queryClient.invalidateQueries({
              queryKey: annotationsQueryKey(meetingDate),
            })
          }}
          onAttachmentDelete={async (annotationId, attachmentId) => {
            await deleteAttachment({ annotationId, attachmentId })
            queryClient.invalidateQueries({
              queryKey: annotationsQueryKey(meetingDate),
            })
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
          topLevelChatAnnotationId={topLevelChatAnnotationId}
          onClose={closeSheet}
          onChatCreated={handleChatCreated}
        />
      )}
    </AnnotationsCtx.Provider>
  )
}
