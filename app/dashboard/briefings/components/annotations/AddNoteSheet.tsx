'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Paperclip, Trash2, X } from 'lucide-react'
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Textarea,
} from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import { reportErrorToSentry } from '@shared/sentry'
import {
  resolveQuoteFromAnchor,
  type ResolvedAnchor,
} from '@shared/briefings/anchorResolver'
import type { Annotation } from '@shared/briefings/types'
import type { SheetState } from './AnnotationsScope'
import type { PredictedPosition } from './enrichForCycler'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'
import { AnchoredQuote } from './AnchoredQuote'
import NoteAttachmentPicker, {
  makeStagedAttachment,
  type PickerItem,
  type StagedAttachment,
} from './NoteAttachmentPicker'

const MAX_BYTES = 20 * 1024 * 1024

const formatBytes = (n: number): string => {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

type Props = {
  sheet: SheetState
  position: PredictedPosition | null
  onClose: () => void
  onCreate: (
    anchor: ResolvedAnchor | null,
    body: string,
    attachments: StagedAttachment[],
  ) => Promise<void> | void
  onUpdate: (annotationId: string, body: string) => Promise<void> | void
  onDelete: (annotationId: string) => Promise<void> | void
  /** Edit mode: upload one file against an existing annotation. */
  onAttachmentAdd: (annotationId: string, file: File) => Promise<void>
  /** Edit mode: delete one attachment from an existing annotation. */
  onAttachmentDelete: (
    annotationId: string,
    attachmentId: string,
  ) => Promise<void>
  /**
   * All existing top-level notes for this briefing. Rendered as a list
   * above the composer when the sheet is in top-level new mode so the
   * user can see, tap-to-edit, or delete previously-added briefing-wide
   * notes (those have no anchor and don't render as highlights).
   */
  topLevelNotes: Annotation[]
  /** Open an existing note in edit mode (from the top-level list). */
  onEditNote: (annotation: Annotation) => void
}

function quoteFor(state: SheetState): string | null {
  if (state.kind === 'add_note_new') {
    return state.anchor?.quote ?? null
  }
  if (state.kind === 'add_note_edit') {
    return resolveQuoteFromAnchor(state.annotation)
  }
  return null
}

function isAddNoteState(state: SheetState): boolean {
  return state.kind === 'add_note_new' || state.kind === 'add_note_edit'
}

/**
 * Right-side Sheet for creating and editing notes.
 *
 * Three states:
 *   - closed
 *   - add_note_new (with optional anchor for selection-driven notes,
 *                   or null for top-level notes). Attachments stage
 *                   locally and upload on Save.
 *   - add_note_edit (existing annotation, edit body or delete). Existing
 *                   attachments render as pills with X. Add/remove are
 *                   immediate (no Save step) — the body still uses Save.
 */
export default function AddNoteSheet({
  sheet,
  position,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onAttachmentAdd,
  onAttachmentDelete,
  topLevelNotes,
  onEditNote,
}: Props): React.JSX.Element {
  const open = isAddNoteState(sheet)
  const isDesktop = !useIsMobile()
  const direction = isDesktop ? 'right' : 'bottom'

  const initialBody =
    sheet.kind === 'add_note_edit' ? sheet.annotation.note?.body ?? '' : ''
  const [body, setBody] = useState(initialBody)
  const [saving, setSaving] = useState(false)
  // New-note mode only. Edit mode talks to the server directly via
  // onAttachmentAdd / onAttachmentDelete and shows the live attachments
  // from `sheet.annotation.note.attachments`.
  const [stagedAttachments, setStagedAttachments] = useState<
    StagedAttachment[]
  >([])
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  // Per-attachment busy state for edit mode — keyed by staged temp id (in
  // flight upload) or server attachment id (in flight delete).
  const [busyAttachmentIds, setBusyAttachmentIds] = useState<Set<string>>(
    () => new Set(),
  )
  // Top-level list rows being deleted — drives the spinner on the X
  // button. Distinct from busyAttachmentIds.
  const [deletingNoteIds, setDeletingNoteIds] = useState<Set<string>>(
    () => new Set(),
  )

  // The sheet prop is a fresh object on every parent render — including
  // ones caused by optimistic cache updates (which produce new annotation
  // references). We only want to reset local state on a logical sheet
  // transition: kind change, or in edit mode, a different annotation id.
  // Otherwise, the user's in-progress textarea typing would get clobbered
  // every time an attachment upload patches the cache.
  const sheetIdentity =
    sheet.kind === 'add_note_edit'
      ? `edit:${sheet.annotation.id}`
      : sheet.kind === 'add_note_new'
      ? `new:${sheet.anchor ? sheet.anchor.jsonPath : 'top'}`
      : sheet.kind
  const prevIdentityRef = useRef<string | null>(null)
  useEffect(() => {
    if (prevIdentityRef.current === sheetIdentity) return
    prevIdentityRef.current = sheetIdentity
    if (sheet.kind === 'add_note_edit') {
      setBody(sheet.annotation.note?.body ?? '')
    } else if (sheet.kind === 'add_note_new') {
      setBody('')
    }
    setStagedAttachments([])
    setAttachmentError(null)
    setSaveError(null)
    setBusyAttachmentIds(new Set())
    setDeletingNoteIds(new Set())
  }, [sheet, sheetIdentity])

  // Clear the user's text selection once the drawer opens — leaving a live
  // selection blocks Vaul's drag-to-dismiss.
  useClearSelectionOnOpen(open)

  const quote = quoteFor(sheet)
  const isEdit = sheet.kind === 'add_note_edit'
  const existingAttachments =
    sheet.kind === 'add_note_edit'
      ? sheet.annotation.note?.attachments ?? []
      : []
  // True when the sheet is opened for a brand-new top-level (briefing-wide)
  // note. In that case we render the user's existing top-level notes
  // above the composer so they can see what's already saved without the
  // drawer needing to be closed and reopened.
  const isTopLevelNew = sheet.kind === 'add_note_new' && sheet.anchor === null

  async function handleListDelete(annotationId: string) {
    if (deletingNoteIds.has(annotationId)) return
    setDeletingNoteIds((prev) => new Set(prev).add(annotationId))
    setSaveError(null)
    try {
      await onDelete(annotationId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setSaveError(`Couldn't delete this note: ${msg}`)
    } finally {
      setDeletingNoteIds((prev) => {
        const next = new Set(prev)
        next.delete(annotationId)
        return next
      })
    }
  }

  function markBusy(id: string, busy: boolean) {
    setBusyAttachmentIds((prev) => {
      const next = new Set(prev)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function handleEditModeAdd(
    annotationId: string,
    file: File,
    source: 'photos' | 'camera' | 'document',
  ) {
    const staged = makeStagedAttachment(file, source)
    setStagedAttachments((prev) => [...prev, staged])
    markBusy(staged.id, true)
    try {
      await onAttachmentAdd(annotationId, file)
      // Refetch will replace the staged row with the server row. Drop
      // the staged entry now so the pill list doesn't briefly show both.
      setStagedAttachments((prev) => prev.filter((a) => a.id !== staged.id))
    } catch (err) {
      setStagedAttachments((prev) => prev.filter((a) => a.id !== staged.id))
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'uploadAttachment',
        annotationId,
        fileName: file.name,
      })
      const msg = err instanceof Error ? err.message : String(err)
      setAttachmentError(`Couldn't upload ${file.name}: ${msg}`)
    } finally {
      markBusy(staged.id, false)
    }
  }

  async function handleEditModeRemove(
    annotationId: string,
    attachmentId: string,
  ) {
    markBusy(attachmentId, true)
    try {
      await onAttachmentDelete(annotationId, attachmentId)
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'deleteAttachment',
        annotationId,
      })
      const msg = err instanceof Error ? err.message : String(err)
      setAttachmentError(`Couldn't remove attachment: ${msg}`)
    } finally {
      markBusy(attachmentId, false)
    }
  }

  function handleAdd(file: File, source: 'photos' | 'camera' | 'document') {
    setAttachmentError(null)
    if (file.size > MAX_BYTES) {
      setAttachmentError(
        `File too large. Max 20 MB; ${formatBytes(file.size)} given.`,
      )
      return
    }
    if (sheet.kind === 'add_note_edit') {
      void handleEditModeAdd(sheet.annotation.id, file, source)
      return
    }
    setStagedAttachments((prev) => [
      ...prev,
      makeStagedAttachment(file, source),
    ])
  }

  function handleRemove(id: string) {
    if (sheet.kind === 'add_note_edit') {
      // In edit mode the id is either a server attachment id or a staged
      // upload's temp id (if the user clicks X mid-upload). Server ids
      // go through the delete API; staged-only entries just disappear.
      const isStaged = stagedAttachments.some((a) => a.id === id)
      if (isStaged) {
        setStagedAttachments((prev) => prev.filter((a) => a.id !== id))
        return
      }
      void handleEditModeRemove(sheet.annotation.id, id)
      return
    }
    setStagedAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)
    setSaveError(null)
    try {
      if (sheet.kind === 'add_note_edit') {
        await onUpdate(sheet.annotation.id, body)
      } else if (sheet.kind === 'add_note_new') {
        await onCreate(sheet.anchor, body, stagedAttachments)
      }
      onClose()
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: isEdit ? 'updateNote' : 'create',
      })
      const msg = err instanceof Error ? err.message : String(err)
      // If the inner handler already framed its own message (e.g. a partial
      // save where the note saved but uploads failed), surface that text
      // directly instead of double-prefixing it.
      setSaveError(
        /^(Saved|Couldn|Failed)/i.test(msg)
          ? msg
          : `Couldn't save your note: ${msg}`,
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteNote() {
    if (sheet.kind !== 'add_note_edit' || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      await onDelete(sheet.annotation.id)
      onClose()
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'remove',
      })
      const msg = err instanceof Error ? err.message : String(err)
      setSaveError(`Couldn't delete this note: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  // The list the picker renders. In new-note mode it's just staged files;
  // in edit mode it's the server-side attachments plus any uploads still
  // in flight.
  const pickerItems: PickerItem[] = useMemo(() => {
    if (sheet.kind === 'add_note_edit') {
      const existing: PickerItem[] = existingAttachments.map((att) => ({
        id: att.id,
        label: att.fileName,
        busy: busyAttachmentIds.has(att.id),
      }))
      const inflight: PickerItem[] = stagedAttachments.map((s) => ({
        id: s.id,
        label: s.file.name,
        busy: busyAttachmentIds.has(s.id),
      }))
      return [...existing, ...inflight]
    }
    return stagedAttachments.map((s) => ({
      id: s.id,
      label: s.file.name,
    }))
  }, [sheet, existingAttachments, stagedAttachments, busyAttachmentIds])

  // New-note saves allow body-only or attachment-only. Edit mode's Save
  // commits the body; attachment changes happen immediately, so Save is
  // enabled whenever the body still has content (we treat fully empty
  // body as "delete the note" — handled by the explicit Delete action).
  const canSave =
    !saving &&
    (isEdit
      ? body.trim().length > 0
      : body.trim().length > 0 || stagedAttachments.length > 0)

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => (v ? null : onClose())}
      direction={direction}
    >
      <DrawerContent className="flex flex-col gap-0 p-0 data-[vaul-drawer-direction=right]:sm:max-w-[480px]">
        <DrawerHeader className="gap-2 px-6 pb-4 pr-12 pt-6">
          <DrawerTitle className="text-2xl font-semibold tracking-tight text-foreground">
            {isEdit ? 'Edit note' : 'Add a Note'}
          </DrawerTitle>
          {position ? (
            <p className="text-center text-sm font-medium text-foreground">
              Note {position.position} of {position.total}
            </p>
          ) : null}
          {!isEdit ? (
            <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
              Highlight any text to add a note.
            </p>
          ) : null}
        </DrawerHeader>

        <div
          data-vaul-no-drag
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-3"
        >
          {quote ? (
            <AnchoredQuote text={quote} showLabel={false} />
          ) : !isEdit ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm italic text-muted-foreground">
              This note is for the whole briefing.
            </p>
          ) : null}

          {(() => {
            if (!isTopLevelNew) return null
            // Hide notes that have neither a body nor any attachments yet.
            // This covers the brief window between create.mutateAsync
            // resolving and the attachment uploads' refetch landing —
            // rendering them would flash "(empty note)" for a frame.
            const visibleNotes = topLevelNotes.filter(
              (n) =>
                (n.note?.body ?? '').trim().length > 0 ||
                (n.note?.attachments?.length ?? 0) > 0,
            )
            if (visibleNotes.length === 0) return null
            return (
              <ul className="flex list-none flex-col gap-2">
                {visibleNotes.map((n) => {
                  const attachCount = n.note?.attachments?.length ?? 0
                  const preview = (n.note?.body ?? '').trim()
                  const label =
                    preview.length > 0
                      ? preview
                      : `${attachCount} attachment${
                          attachCount === 1 ? '' : 's'
                        }`
                  const busy = deletingNoteIds.has(n.id)
                  return (
                    <li key={n.id}>
                      <div className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 transition-colors hover:bg-muted/60">
                        <button
                          type="button"
                          onClick={() => onEditNote(n)}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm focus:outline-none"
                        >
                          <span className="line-clamp-2 min-w-0 flex-1 text-foreground">
                            {label}
                          </span>
                          {attachCount > 0 ? (
                            <span
                              aria-label={`${attachCount} attached file${
                                attachCount === 1 ? '' : 's'
                              }`}
                              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              <Paperclip className="size-3" aria-hidden />
                              {attachCount}
                            </span>
                          ) : null}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleListDelete(n.id)}
                          disabled={busy}
                          aria-label="Delete note"
                          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {busy ? (
                            <Loader2
                              className="size-4 animate-spin"
                              aria-hidden
                            />
                          ) : (
                            <X className="size-4" aria-hidden />
                          )}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )
          })()}
        </div>

        {/* Composer pinned at the bottom. The attachment picker sits above
            the input/Save row, right-aligned so its button and pills hug
            the side near the Save action. Delete (edit mode only) sits
            below the composer so the destructive action stays one tap
            away but never sits beside the text input. */}
        <div
          data-vaul-no-drag
          className="flex flex-col gap-2 bg-background px-4 py-3"
        >
          <NoteAttachmentPicker
            items={pickerItems}
            onAdd={handleAdd}
            onRemove={handleRemove}
            disabled={saving}
            error={attachmentError}
          />
          <div className="flex items-end gap-2">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your note…"
              rows={3}
              className="max-h-[180px] min-h-[60px] flex-1 resize-none rounded-2xl"
            />
            <Button
              type="button"
              disabled={!canSave}
              onClick={handleSave}
              className="shrink-0"
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
          {saveError ? (
            <p role="alert" className="text-sm text-destructive">
              {saveError}
            </p>
          ) : null}
          {isEdit ? (
            <Button
              type="button"
              size="small"
              variant="link"
              disabled={saving}
              onClick={handleDeleteNote}
              className="self-center gap-1.5 text-destructive"
            >
              <Trash2 className="size-4" aria-hidden />
              Delete note
            </Button>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
