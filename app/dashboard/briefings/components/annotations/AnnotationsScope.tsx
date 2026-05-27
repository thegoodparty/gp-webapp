'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  EMPTY_ANCHOR,
  pointToOffset,
  type ResolvedAnchor,
} from '@shared/briefings/anchorResolver'
import {
  annotationsQueryKey,
  useAnnotations,
} from '@shared/briefings/use-annotations'
import { useSelection } from '@shared/briefings/use-selection'
import type {
  Annotation,
  AnnotationAnchor,
  AnnotationNoteAttachmentData,
} from '@shared/briefings/types'
import HighlightToolbar from './HighlightToolbar'
import AddNoteSheet from './AddNoteSheet'
import ReportErrorSheet from './ReportErrorSheet'
import AnnotationsHighlightLayer from './AnnotationsHighlightLayer'
import { NotesSurface } from './NotesSurface'
import { BriefingAssistantSurface } from './BriefingAssistantSurface'
import { BugReportsSurface } from './BugReportsSurface'
import {
  findAnnotationPosition,
  predictNewAnnotationPosition,
} from './enrichForCycler'
import {
  deleteAttachment,
  resolveMimeType,
  uploadAttachment,
} from '@shared/briefings/attachments-api'
import { chatApi } from '@shared/briefings/chat-api'
import { reportErrorToSentry } from '@shared/sentry'

/**
 * Either an in-progress selection-driven anchor, or null for a top-level
 * (page-scoped) annotation.
 */
export type PendingAnchor = ResolvedAnchor | null

/**
 * Overlay state — covers the right-side cycler surfaces and the legacy
 * AddNote / ReportError single-annotation sheets. One overlay is open at
 * a time. Chats no longer have their own legacy sheet; they share the
 * cycler surface with the rest of the annotation kinds.
 */
export type OverlayState =
  | { kind: 'closed' }
  | { kind: 'add_note_new'; anchor: PendingAnchor }
  | { kind: 'add_note_edit'; annotation: Annotation }
  | { kind: 'report_error_new'; anchor: PendingAnchor }
  | { kind: 'report_error_view'; annotation: Annotation }
  | { kind: 'surface_notes'; initialAnnotationId?: string }
  | {
      kind: 'surface_chats'
      initialAnnotationId?: string
      pendingAnchor?: AnnotationAnchor
    }
  | { kind: 'surface_bug_reports'; initialAnnotationId?: string }

/**
 * Legacy alias retained for external imports — overlays now include
 * popovers as well as sheets, but the type name is preserved to avoid a
 * cross-file rename.
 */
export type SheetState = OverlayState

/**
 * The user-active card on the briefing detail page. Drives the blue
 * outline rendered on the card itself and the highlighted entry in the
 * sidebar legend. Also determines where the top-of-page "Add note"
 * button attaches new notes — they get this card's `jsonPath` as their
 * anchor (with `start`/`end` null, marking them as card-level rather
 * than passage-level).
 */
export type ActiveCard = {
  /** Stable identity used by the legend to highlight the matching entry. */
  key: string
  /**
   * Canonical jsonPath for this card as a whole (no field suffix).
   * `/executiveSummary` for the exec summary, `/items/{index}` for an
   * agenda item.
   */
  jsonPath: string
  /** Display title — used by AddNoteSheet for the "Note on …" copy. */
  title: string
}

type Ctx = {
  meetingDate: string
  /**
   * Id of the user's existing top-level chat annotation on this briefing,
   * if any. Passed to AskAiSheet so a top-level reopen skips
   * `createBriefingChat` and loads prior messages directly. Undefined when
   * no top-level chat exists yet — first open will mint one.
   */
  topLevelChatAnnotationId?: string
  /** Live annotations list — exposed so cards can render their own
   *  card-level notes inline without re-fetching. */
  annotations: Annotation[]
  /** Currently-focused card. Null only briefly before the layout sets a
   *  default; the header "Add note" button is disabled while null. */
  activeCard: ActiveCard | null
  /** Set when the user clicks the card body or a legend entry. Pure
   *  state; does NOT scroll the pane (legend handles scrolling). */
  setActiveCard: (card: ActiveCard) => void
  openAddNoteFromSelection: () => void
  openAddNoteTopLevel: () => void
  openReportErrorFromSelection: () => void
  openEditNote: (annotation: Annotation) => void
  openViewReport: (annotation: Annotation) => void
  openNotesSurface: (initialAnnotationId?: string) => void
  openChatsSurface: (initialAnnotationId?: string) => void
  openBugReportsSurface: (initialAnnotationId?: string) => void
  notesCount: number
  chatsCount: number
  bugReportsCount: number
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
  /**
   * The card that should be active before the user clicks anything —
   * typically the Executive Summary. Optional only because some test
   * mounts don't need an active card.
   */
  initialActiveCard?: ActiveCard
  children: React.ReactNode
}

function anchorPayload(anchor: PendingAnchor): AnnotationAnchor {
  if (!anchor) return EMPTY_ANCHOR
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
  initialActiveCard,
  children,
}: Props): React.JSX.Element {
  const liveAnchor = useSelection()
  const queryClient = useQueryClient()
  const { annotations, create, updateNote, remove } =
    useAnnotations(meetingDate)
  const [overlay, setOverlay] = useState<OverlayState>({ kind: 'closed' })
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(
    initialActiveCard ?? null,
  )
  // Holds the id of a chat freshly-minted from a pending-anchor preempt.
  // Defer the handoff until React Query refetch settles and the new chat
  // appears in `annotations`; otherwise the cycler binds to an id
  // `items.findIndex(...)` can't yet resolve and falls back to index 0.
  const pendingNewChatIdRef = useRef<string | null>(null)
  // Same pattern for notes and bug reports created via AddNoteSheet /
  // ReportErrorSheet. Those sheets call `onClose()` after `onCreate`
  // resolves, which clobbers any synchronous setOverlay(surface_*). Stash
  // the new id and a watch effect swaps overlay once the optimistic cache
  // write makes the annotation visible.
  const pendingNewNoteIdRef = useRef<string | null>(null)
  const pendingNewBugReportIdRef = useRef<string | null>(null)

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

  // The top-level "Add notes" button on the header / mobile bar attaches
  // the note to whichever card is currently active. A card may carry at
  // most one card-level note — if the active card already has one, open
  // the notes cycler focused on it (matching the click-into-a-passage-
  // anchored-highlight flow, so users can page between notes from the
  // same entry point). Otherwise open the new-note sheet with a null
  // `anchor`; the scope's onCreate handler resolves the card's jsonPath
  // at save time. If no card is active, the button does nothing.
  const openAddNoteTopLevel = useCallback(() => {
    if (!activeCard) return
    const existing = annotations.find(
      (a) =>
        a.kind === 'note' &&
        a.jsonPath === activeCard.jsonPath &&
        a.start === null &&
        a.end === null,
    )
    if (existing) {
      setOverlay({ kind: 'surface_notes', initialAnnotationId: existing.id })
      return
    }
    setOverlay({ kind: 'add_note_new', anchor: null })
  }, [activeCard, annotations])

  const openReportErrorFromSelection = useCallback(() => {
    setOverlay({ kind: 'report_error_new', anchor: liveAnchor })
  }, [liveAnchor])

  const openEditNote = useCallback((annotation: Annotation) => {
    setOverlay({ kind: 'add_note_edit', annotation })
  }, [])

  const openViewReport = useCallback((annotation: Annotation) => {
    setOverlay({ kind: 'report_error_view', annotation })
  }, [])

  const openNotesSurface = useCallback((initialAnnotationId?: string) => {
    setOverlay({ kind: 'surface_notes', initialAnnotationId })
  }, [])

  const openChatsSurface = useCallback((initialAnnotationId?: string) => {
    setOverlay({ kind: 'surface_chats', initialAnnotationId })
  }, [])

  const openBugReportsSurface = useCallback((initialAnnotationId?: string) => {
    setOverlay({ kind: 'surface_bug_reports', initialAnnotationId })
  }, [])

  const closeSheet = useCallback(() => {
    setOverlay({ kind: 'closed' })
  }, [])

  // Pending-anchor handoff: after a fresh chat is minted from the empty
  // composer, wait for it to appear in `annotations` (post-refetch), then
  // swap the overlay from "preempt with pendingAnchor" to "cycler focused
  // on the new chat at its sorted position".
  useEffect(() => {
    const targetId = pendingNewChatIdRef.current
    if (!targetId) return
    if (overlay.kind !== 'surface_chats') return
    if (!overlay.pendingAnchor) return
    if (!annotations.some((a) => a.id === targetId)) return
    pendingNewChatIdRef.current = null
    setOverlay({
      kind: 'surface_chats',
      initialAnnotationId: targetId,
    })
  }, [annotations, overlay])

  // Note create handoff: after AddNoteSheet's onCreate resolves and onClose
  // runs (overlay → closed), the optimistic write in create.onSuccess lands
  // the new note in `annotations`. This effect then swaps the overlay to the
  // notes cycler focused on the new note.
  //
  // Guarded to only fire when overlay is `closed` so a stale ref can't
  // overwrite a different overlay the user has opened in the meantime
  // (e.g. close → open bug reports surface while the optimistic write is
  // still mid-flight).
  useEffect(() => {
    if (overlay.kind !== 'closed') return
    const targetId = pendingNewNoteIdRef.current
    if (!targetId) return
    if (!annotations.some((a) => a.id === targetId)) return
    pendingNewNoteIdRef.current = null
    setOverlay({
      kind: 'surface_notes',
      initialAnnotationId: targetId,
    })
  }, [annotations, overlay.kind])

  // Bug report create handoff — mirrors the note handoff above, with the
  // same overlay-kind guard.
  useEffect(() => {
    if (overlay.kind !== 'closed') return
    const targetId = pendingNewBugReportIdRef.current
    if (!targetId) return
    if (!annotations.some((a) => a.id === targetId)) return
    pendingNewBugReportIdRef.current = null
    setOverlay({
      kind: 'surface_bug_reports',
      initialAnnotationId: targetId,
    })
  }, [annotations, overlay.kind])

  // Stale pending-id cleanup. When the overlay returns to `closed`, drop
  // any pending refs so a later annotation arrival can't pop a surface open
  // against the user's intent. The watch effects above clear refs on
  // success, but if the user closes a surface before the optimistic write
  // lands (or before the refetch settles), the ref would otherwise leak
  // forever and bind a future overlay swap to a stale annotation id.
  useEffect(() => {
    if (overlay.kind === 'closed') {
      pendingNewChatIdRef.current = null
      pendingNewNoteIdRef.current = null
      pendingNewBugReportIdRef.current = null
    }
  }, [overlay.kind])

  // Click-to-open: if the user clicks (collapsed mouseup) inside a region
  // covered by an existing annotation, open that annotation's overlay.
  useEffect(() => {
    if (typeof window === 'undefined') return

    function openAnnotation(ann: Annotation) {
      if (ann.kind === 'note') {
        setOverlay({ kind: 'surface_notes', initialAnnotationId: ann.id })
      } else if (ann.kind === 'bug_report') {
        setOverlay({
          kind: 'surface_bug_reports',
          initialAnnotationId: ann.id,
        })
      } else if (ann.kind === 'chat') {
        setOverlay({ kind: 'surface_chats', initialAnnotationId: ann.id })
      }
    }

    function onClick(e: MouseEvent) {
      // Don't intercept drag-to-select: only handle plain clicks.
      const sel = window.getSelection()
      if (sel && !sel.isCollapsed && sel.toString().length > 0) return

      if (!(e.target instanceof HTMLElement)) return
      const target = e.target

      // Marker icons (note / chat / bug) are inline DOM nodes inserted at
      // the end of each annotation's range. Pointer hits on them should
      // open the matching annotation overlay; pointToOffset can't see them
      // because they're outside the briefing's text run.
      const marker = target.closest(
        '.briefing-note-marker[data-annotation-id], .briefing-chat-marker[data-annotation-id], .briefing-bug-marker[data-annotation-id]',
      )
      if (marker instanceof HTMLElement) {
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

  // Suppress the OS context menu / selection callout on annotation-
  // enabled passages so only the briefing's HighlightToolbar surfaces
  // on text selection. iOS's long-press menu is handled via
  // `-webkit-touch-callout: none` in AnnotationsHighlightLayer's CSS,
  // but Android Chrome and desktop browsers still fire `contextmenu` on
  // long-press / right-click — preventDefault here suppresses that
  // path. Selection itself still works (the toolbar reads it via
  // useSelection); we're only blocking the system menu.
  useEffect(() => {
    if (typeof window === 'undefined') return
    function onContextMenu(e: MouseEvent) {
      if (!(e.target instanceof HTMLElement)) return
      if (e.target.closest('[data-briefing-json-path]')) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', onContextMenu)
    return () => document.removeEventListener('contextmenu', onContextMenu)
  }, [])

  const topLevelChatAnnotationId = useMemo(
    () => annotations.find((a) => a.kind === 'chat' && a.jsonPath === null)?.id,
    [annotations],
  )

  // Legacy briefing-wide notes (jsonPath === null) come from the old
  // top-level intake that no longer exists. They aren't surfaced in any
  // UI any more — neither as inline card rows nor in the NotesSurface
  // list nor in the count badge — but the rows are kept in the database
  // so we can recover or migrate them later if needed. Everything else
  // (real card-level + passage-anchored notes) flows through unchanged.
  const visibleAnnotations = useMemo(
    () =>
      annotations.filter((a) => !(a.kind === 'note' && a.jsonPath === null)),
    [annotations],
  )

  const { notesCount, chatsCount, bugReportsCount } = useMemo(() => {
    let n = 0
    let c = 0
    let b = 0
    for (const a of visibleAnnotations) {
      if (a.kind === 'note') n++
      else if (a.kind === 'chat') c++
      else if (a.kind === 'bug_report') b++
    }
    return { notesCount: n, chatsCount: c, bugReportsCount: b }
  }, [visibleAnnotations])

  // Memoize position calculations — both helpers scan annotations and the
  // predict path walks the DOM via querySelectorAll, so we don't want them
  // re-running on every parent render while a sheet is open.
  const notePosition = useMemo(() => {
    if (overlay.kind === 'add_note_new') {
      return predictNewAnnotationPosition(
        annotations,
        'note',
        overlay.anchor
          ? { jsonPath: overlay.anchor.jsonPath, start: overlay.anchor.start }
          : null,
      )
    }
    if (overlay.kind === 'add_note_edit') {
      return findAnnotationPosition(annotations, 'note', overlay.annotation.id)
    }
    return null
  }, [annotations, overlay])

  const bugReportPosition = useMemo(() => {
    if (overlay.kind === 'report_error_new') {
      return predictNewAnnotationPosition(
        annotations,
        'bug_report',
        overlay.anchor
          ? { jsonPath: overlay.anchor.jsonPath, start: overlay.anchor.start }
          : null,
      )
    }
    if (overlay.kind === 'report_error_view') {
      return findAnnotationPosition(
        annotations,
        'bug_report',
        overlay.annotation.id,
      )
    }
    return null
  }, [annotations, overlay])

  // Keep edit-mode overlay snapshot synced with the live annotations query
  // so attachments added/removed via the picker show without reopening.
  // If the annotation has vanished from the cache (refetch race, concurrent
  // delete from another tab), do NOT force-close — that silently drops the
  // user's in-progress typing held in AddNoteSheet's body state. Let the
  // user finish typing; if they hit Save, updateNote will hit the server,
  // get a 404, and the existing error-banner path surfaces the issue.
  useEffect(() => {
    if (overlay.kind !== 'add_note_edit') return
    const fresh = annotations.find((a) => a.id === overlay.annotation.id)
    if (!fresh) return
    if (fresh !== overlay.annotation) {
      setOverlay({ kind: 'add_note_edit', annotation: fresh })
    }
  }, [annotations, overlay])

  const ctxValue: Ctx = useMemo(
    () => ({
      meetingDate,
      topLevelChatAnnotationId,
      annotations: visibleAnnotations,
      activeCard,
      setActiveCard,
      openAddNoteFromSelection,
      openAddNoteTopLevel,
      openReportErrorFromSelection,
      openEditNote,
      openViewReport,
      openNotesSurface,
      openChatsSurface,
      openBugReportsSurface,
      notesCount,
      chatsCount,
      bugReportsCount,
      closeSheet,
      onChatCreated: handleChatCreated,
    }),
    [
      meetingDate,
      topLevelChatAnnotationId,
      visibleAnnotations,
      activeCard,
      openAddNoteFromSelection,
      openAddNoteTopLevel,
      openReportErrorFromSelection,
      openEditNote,
      openViewReport,
      openNotesSurface,
      openChatsSurface,
      openBugReportsSurface,
      notesCount,
      chatsCount,
      bugReportsCount,
      closeSheet,
      handleChatCreated,
    ],
  )

  return (
    <AnnotationsCtx.Provider value={ctxValue}>
      {children}
      <AnnotationsHighlightLayer annotations={annotations} />
      <HighlightToolbar
        anchor={liveAnchor}
        onAddNote={openAddNoteFromSelection}
        onReportError={openReportErrorFromSelection}
        onAskAi={() => {
          if (liveAnchor) {
            setOverlay({
              kind: 'surface_chats',
              pendingAnchor: {
                jsonPath: liveAnchor.jsonPath,
                start: liveAnchor.start,
                end: liveAnchor.end,
              },
            })
          } else {
            openChatsSurface()
          }
        }}
      />
      {(overlay.kind === 'add_note_new' ||
        overlay.kind === 'add_note_edit') && (
        <AddNoteSheet
          sheet={overlay}
          position={notePosition}
          onClose={closeSheet}
          onCreate={async (anchor, body, attachments) => {
            // body is `string().min(1).optional()` server-side — omit when
            // the user only attached files without typing.
            const trimmedBody = body.trim()
            // anchor=null from the top-of-page "Add note" button means
            // "attach to the active card." We translate that here so the
            // note carries the card's jsonPath with null start/end — the
            // schema convention for card-level (not passage-level) notes.
            const resolvedAnchor: AnnotationAnchor = anchor
              ? anchorPayload(anchor)
              : activeCard
              ? { jsonPath: activeCard.jsonPath, start: null, end: null }
              : EMPTY_ANCHOR
            const created = await create.mutateAsync({
              kind: 'note',
              anchor: resolvedAnchor,
              payload: trimmedBody.length > 0 ? { body: trimmedBody } : {},
            })
            window.getSelection()?.removeAllRanges()
            // Upload any staged attachments serially. Per-file failures
            // don't roll back the note — collect names and throw at the end
            // so AddNoteSheet's handleSave surfaces the error inline. Each
            // failure is reported to Sentry with surface/op/annotationId/
            // fileName context so we can triage from the dashboard.
            const failures: string[] = []
            for (const a of attachments) {
              try {
                await uploadAttachment({
                  annotationId: created.id,
                  file: a.file,
                })
              } catch (err) {
                reportErrorToSentry(err, {
                  surface: 'briefing-annotations',
                  op: 'uploadAttachment',
                  annotationId: created.id,
                  fileName: a.file.name,
                })
                failures.push(a.file.name)
              }
            }
            if (attachments.length > 0) {
              queryClient.invalidateQueries({
                queryKey: annotationsQueryKey(meetingDate),
              })
            }
            if (failures.length > 0) {
              // The note was saved server-side, but one or more attachment
              // uploads failed. Transition the overlay into edit mode
              // against the just-created annotation so a Save retry hits
              // onUpdate (no duplicate note) and the user can retry failed
              // attachments through the per-pill onAttachmentAdd path. We
              // deliberately do NOT set pendingNewNoteIdRef here — the
              // cycler handoff is for clean success only.
              setOverlay({ kind: 'add_note_edit', annotation: created })
              throw new Error(
                `Saved your note, but couldn't upload: ${failures.join(', ')}`,
              )
            }
            // Success: stash id for the cycler handoff (watch effect swaps
            // overlay to surface_notes once the new note lands in
            // `annotations`).
            pendingNewNoteIdRef.current = created.id
          }}
          onUpdate={async (id, body) => {
            await updateNote.mutateAsync({ id, body })
          }}
          onDelete={async (id) => {
            await remove.mutateAsync(id)
          }}
          onAttachmentAdd={async (annotationId, file) => {
            const { attachmentId } = await uploadAttachment({
              annotationId,
              file,
            })
            // Inject the new attachment into the cached annotations list
            // synchronously so the edit sheet shows it the moment the
            // upload resolves. `invalidateQueries` below still kicks off
            // a refetch to sync server-side fields the client can't
            // compute (OCR status, completion time, etc.).
            const optimistic: AnnotationNoteAttachmentData = {
              id: attachmentId,
              fileName: file.name,
              mimeType: resolveMimeType(file),
              sizeBytes: file.size,
              ocrStatus: 'pending',
              ocrText: null,
              ocrError: null,
              ocrCompletedAt: null,
              createdAt: new Date().toISOString(),
            }
            queryClient.setQueryData<Annotation[]>(
              annotationsQueryKey(meetingDate),
              (prev) =>
                prev?.map((ann) =>
                  ann.id === annotationId && ann.note
                    ? {
                        ...ann,
                        note: {
                          ...ann.note,
                          attachments: [
                            ...(ann.note.attachments ?? []),
                            optimistic,
                          ],
                        },
                      }
                    : ann,
                ),
            )
            queryClient.invalidateQueries({
              queryKey: annotationsQueryKey(meetingDate),
            })
          }}
          onAttachmentDelete={async (annotationId, attachmentId) => {
            await deleteAttachment({ annotationId, attachmentId })
            // Drop the row from the cache optimistically so the pill
            // disappears immediately without waiting for a refetch.
            queryClient.setQueryData<Annotation[]>(
              annotationsQueryKey(meetingDate),
              (prev) =>
                prev?.map((ann) =>
                  ann.id === annotationId && ann.note
                    ? {
                        ...ann,
                        note: {
                          ...ann.note,
                          attachments: (ann.note.attachments ?? []).filter(
                            (a) => a.id !== attachmentId,
                          ),
                        },
                      }
                    : ann,
                ),
            )
            queryClient.invalidateQueries({
              queryKey: annotationsQueryKey(meetingDate),
            })
          }}
          activeCardTitle={activeCard?.title ?? null}
        />
      )}
      {(overlay.kind === 'report_error_new' ||
        overlay.kind === 'report_error_view') && (
        <ReportErrorSheet
          sheet={overlay}
          position={bugReportPosition}
          onClose={closeSheet}
          onCreate={async (anchor, description) => {
            const created = await create.mutateAsync({
              kind: 'bug_report',
              anchor: anchorPayload(anchor),
              payload: { description },
            })
            window.getSelection()?.removeAllRanges()
            // ReportErrorSheet calls onClose() synchronously after onCreate
            // resolves — that fires after any microtask we'd schedule here,
            // so a setOverlay(surface_bug_reports) right here gets clobbered.
            // Instead stash the id; the watch effect above swaps overlay
            // to the cycler once the optimistic cache write makes the new
            // bug report visible in `annotations`.
            pendingNewBugReportIdRef.current = created.id
          }}
          onDelete={async (id) => {
            await remove.mutateAsync(id)
          }}
        />
      )}
      <NotesSurface
        open={overlay.kind === 'surface_notes'}
        onClose={closeSheet}
        annotations={visibleAnnotations}
        onEditNote={(ann) =>
          setOverlay({ kind: 'add_note_edit', annotation: ann })
        }
        onDeleteNote={(ann) => remove.mutateAsync(ann.id).then(() => undefined)}
        initialAnnotationId={
          overlay.kind === 'surface_notes'
            ? overlay.initialAnnotationId
            : undefined
        }
      />
      <BriefingAssistantSurface
        open={overlay.kind === 'surface_chats'}
        onClose={closeSheet}
        meetingDate={meetingDate}
        annotations={annotations}
        initialAnnotationId={
          overlay.kind === 'surface_chats'
            ? overlay.initialAnnotationId
            : undefined
        }
        pendingAnchor={
          overlay.kind === 'surface_chats' ? overlay.pendingAnchor : undefined
        }
        onChatCreated={(info) => {
          const anchor =
            overlay.kind === 'surface_chats' && overlay.pendingAnchor
              ? overlay.pendingAnchor
              : null
          handleChatCreated({ ...info, anchor })
          // Stash the id; the watch effect below swaps overlay to the
          // cycler view once React Query refetches and the new chat lands
          // in `annotations`. Doing it synchronously here races the
          // refetch and leaves the cycler at "Chat 1 of N".
          if (overlay.kind === 'surface_chats' && overlay.pendingAnchor) {
            pendingNewChatIdRef.current = info.annotationId
          }
        }}
        onDeleteChat={async (ann) => {
          try {
            await chatApi.softDelete(ann.id)
          } catch (err) {
            reportErrorToSentry(err, {
              surface: 'briefing-annotations',
              op: 'softDeleteChat',
              annotationId: ann.id,
              meetingDate,
            })
            throw err
          }
          queryClient.setQueryData<Annotation[]>(
            annotationsQueryKey(meetingDate),
            (prev) => prev?.filter((a) => a.id !== ann.id),
          )
        }}
      />
      <BugReportsSurface
        open={overlay.kind === 'surface_bug_reports'}
        onClose={closeSheet}
        annotations={annotations}
        onDeleteBugReport={(ann) =>
          remove.mutateAsync(ann.id).then(() => undefined)
        }
        initialAnnotationId={
          overlay.kind === 'surface_bug_reports'
            ? overlay.initialAnnotationId
            : undefined
        }
      />
    </AnnotationsCtx.Provider>
  )
}
