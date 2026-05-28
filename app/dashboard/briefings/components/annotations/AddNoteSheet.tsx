'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  Button,
  cn,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Textarea,
} from '@styleguide'
import { useDictationAppend } from '../../shared/useDictationAppend'
import { DictationMicButton } from '../../shared/DictationMicButton'
import { DictationFeedback } from '../../shared/DictationFeedback'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import { reportErrorToSentry } from '@shared/sentry'
import {
  resolveQuoteFromAnchor,
  type ResolvedAnchor,
} from '@shared/briefings/anchorResolver'
import type { Item } from '@shared/briefings/types'
import type { SheetState } from './AnnotationsScope'
import type { PredictedPosition } from './enrichForCycler'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'
import { AnchoredQuote } from './AnchoredQuote'
import NoteAttachmentPicker, {
  makeStagedAttachment,
  type PickerItem,
  type StagedAttachment,
} from './NoteAttachmentPicker'
import { sectionLabelFromPath } from './sectionLabel'

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
  /** Title of the active card — drives the "Note on {title}" copy when
   *  there's no anchor (top-level new-note flow). */
  activeCardTitle: string | null
  /**
   * Agenda items used to derive the uppercase section label (e.g.
   * "COLONIAL THEATRE...") that sits above the anchored quote.
   */
  briefingItems?: readonly Item[]
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
 *                   or null for active-card-level notes). Attachments
 *                   stage locally and upload on Save.
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
  activeCardTitle,
  briefingItems,
}: Props): React.JSX.Element {
  const open = isAddNoteState(sheet)
  const isDesktop = !useIsMobile()
  const direction = isDesktop ? 'right' : 'bottom'

  const initialBody =
    sheet.kind === 'add_note_edit' ? sheet.annotation.note?.body ?? '' : ''
  const [body, setBody] = useState(initialBody)
  const [saving, setSaving] = useState(false)

  const dictation = useDictationAppend({
    analyticsLabel: 'add_note_sheet',
    value: body,
    onChange: setBody,
  })
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
  }, [sheet, sheetIdentity])

  // Clear the user's text selection once the drawer opens — leaving a live
  // selection blocks Vaul's drag-to-dismiss.
  useClearSelectionOnOpen(open)

  const quote = quoteFor(sheet)
  const anchorJsonPath =
    sheet.kind === 'add_note_edit'
      ? sheet.annotation.jsonPath
      : sheet.kind === 'add_note_new'
      ? sheet.anchor?.jsonPath ?? null
      : null
  const sectionLabel = sectionLabelFromPath(anchorJsonPath, briefingItems)
  const isEdit = sheet.kind === 'add_note_edit'
  const existingAttachments =
    sheet.kind === 'add_note_edit'
      ? sheet.annotation.note?.attachments ?? []
      : []

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

  // The list the picker renders. Edit mode mixes server attachments
  // (fetched-on-demand signed URLs for thumbnails) with inflight staged
  // uploads; new-note mode is just staged files (blob URL thumbnails).
  const pickerItems: PickerItem[] = useMemo(() => {
    if (sheet.kind === 'add_note_edit') {
      const annotationId = sheet.annotation.id
      const existing: PickerItem[] = existingAttachments.map((att) => ({
        kind: 'server' as const,
        id: att.id,
        label: att.fileName,
        mimeType: att.mimeType,
        annotationId,
        attachmentId: att.id,
        busy: busyAttachmentIds.has(att.id),
      }))
      const inflight: PickerItem[] = stagedAttachments.map((s) => ({
        kind: 'staged' as const,
        id: s.id,
        label: s.file.name,
        mimeType: s.file.type,
        file: s.file,
        busy: busyAttachmentIds.has(s.id),
      }))
      return [...existing, ...inflight]
    }
    return stagedAttachments.map((s) => ({
      kind: 'staged' as const,
      id: s.id,
      label: s.file.name,
      mimeType: s.file.type,
      file: s.file,
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
        <DrawerHeader className="gap-2 border-b border-border px-6 pb-4 pr-12 pt-6">
          <DrawerTitle
            className={cn(
              'text-2xl font-semibold tracking-tight text-foreground',
              // Mobile drops the visible title to match Lovable. The
              // DrawerTitle still renders for Radix a11y, just sr-only.
              !isDesktop && 'sr-only',
            )}
          >
            {isEdit ? 'Edit note' : 'Add a note'}
          </DrawerTitle>
          {position ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Note {position.position} of {position.total}
              </span>
            </div>
          ) : null}
          {!isEdit ? (
            <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
              Add a note to this agenda item or highlight any text to add a note
              for just that part.
            </p>
          ) : null}
        </DrawerHeader>

        <div
          data-vaul-no-drag
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-3 pt-4"
        >
          {/* Section header. For anchored notes (`quote` set) we render
              the full AnchoredQuote — label + quoted text. For card-level
              notes (no quote) we still want the user to see WHICH card
              they're noting; show the same uppercase label by itself.
              `sectionLabel` is derived from `jsonPath` (works for edit
              mode and selection-anchored new notes); `activeCardTitle`
              is the fallback for top-level "Add notes" where `anchor`
              is null and jsonPath is resolved at save time. */}
          {quote ? (
            <AnchoredQuote
              text={quote}
              variant="primary"
              showLabel={sectionLabel !== null}
              label={sectionLabel ?? undefined}
            />
          ) : sectionLabel || activeCardTitle ? (
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {sectionLabel ?? activeCardTitle?.toUpperCase()}
            </span>
          ) : null}
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
          <div className="relative">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key !== 'Enter' ||
                  e.shiftKey ||
                  e.nativeEvent.isComposing
                ) {
                  return
                }
                e.preventDefault()
                if (canSave) void handleSave()
              }}
              placeholder="Write a note, then tap Add Note..."
              rows={3}
              className="max-h-[180px] min-h-[96px] w-full resize-none rounded-2xl pr-12"
            />
            <DictationMicButton
              dictation={dictation}
              idleLabel="Dictate note"
              recordingLabel="Stop dictation"
              disabled={saving}
            />
          </div>
          <Button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="w-full"
          >
            {saving
              ? isEdit
                ? 'Saving…'
                : 'Adding…'
              : isEdit
              ? 'Save'
              : 'Add Note'}
          </Button>
          <DictationFeedback dictation={dictation} />
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
