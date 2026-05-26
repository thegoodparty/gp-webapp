'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Textarea,
} from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'
import type { SheetState } from './AnnotationsScope'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'
import NoteAttachmentPicker, {
  makeStagedAttachment,
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
  onClose: () => void
  onCreate: (
    anchor: ResolvedAnchor | null,
    body: string,
    attachments: StagedAttachment[],
  ) => Promise<void> | void
  onUpdate: (annotationId: string, body: string) => Promise<void> | void
  onDelete: (annotationId: string) => Promise<void> | void
}

function quoteFor(state: SheetState): string | null {
  if (state.kind === 'add_note_new') {
    return state.anchor?.quote ?? null
  }
  // Edit mode: the server schema does not store the original quote, and
  // reconstructing it from the live DOM via the anchor is a follow-up.
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
 *                   or null for top-level notes)
 *   - add_note_edit (existing annotation, edit body or delete)
 */
export default function AddNoteSheet({
  sheet,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: Props): React.JSX.Element {
  const open = isAddNoteState(sheet)
  const isDesktop = !useIsMobile()
  const direction = isDesktop ? 'right' : 'bottom'

  const initialBody =
    sheet.kind === 'add_note_edit' ? sheet.annotation.note?.body ?? '' : ''
  const [body, setBody] = useState(initialBody)
  const [saving, setSaving] = useState(false)
  const [attachments, setAttachments] = useState<StagedAttachment[]>([])
  const [attachmentError, setAttachmentError] = useState<string | null>(null)

  // Reset body + staged attachments when the sheet transitions states.
  useEffect(() => {
    if (sheet.kind === 'add_note_edit') {
      setBody(sheet.annotation.note?.body ?? '')
    } else if (sheet.kind === 'add_note_new') {
      setBody('')
    }
    setAttachments([])
    setAttachmentError(null)
  }, [sheet])

  // Clear the user's text selection once the drawer opens — leaving a live
  // selection blocks Vaul's drag-to-dismiss.
  useClearSelectionOnOpen(open)

  const quote = quoteFor(sheet)
  const isEdit = sheet.kind === 'add_note_edit'

  function handleAddAttachment(
    file: File,
    source: 'photos' | 'camera' | 'document',
  ) {
    setAttachmentError(null)
    if (file.size > MAX_BYTES) {
      setAttachmentError(
        `File too large. Max 20 MB; ${formatBytes(file.size)} given.`,
      )
      return
    }
    setAttachments((prev) => [...prev, makeStagedAttachment(file, source)])
  }

  function handleRemoveAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      if (sheet.kind === 'add_note_edit') {
        await onUpdate(sheet.annotation.id, body)
      } else if (sheet.kind === 'add_note_new') {
        await onCreate(sheet.anchor, body, attachments)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (sheet.kind !== 'add_note_edit' || saving) return
    setSaving(true)
    try {
      await onDelete(sheet.annotation.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  // New-note saves are allowed with just attachments and no body — the
  // server's note payload already treats `body` as optional. Edit mode
  // still requires non-empty body (the editor isn't wired for adding
  // attachments to an existing note yet).
  const canSave =
    !saving &&
    (isEdit
      ? body.trim().length > 0
      : body.trim().length > 0 || attachments.length > 0)

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => (v ? null : onClose())}
      direction={direction}
    >
      <DrawerContent className="flex flex-col gap-0 p-0 data-[vaul-drawer-direction=right]:sm:max-w-[480px]">
        <DrawerHeader className="px-6 pb-4 pr-12 pt-6">
          <DrawerTitle className="text-2xl font-semibold tracking-tight text-foreground">
            {isEdit ? 'Edit note' : 'Add a Note'}
          </DrawerTitle>
        </DrawerHeader>

        <div
          data-vaul-no-drag
          className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4"
        >
          {quote ? (
            <blockquote className="border-l-2 border-border pl-3 text-sm italic leading-6 text-muted-foreground">
              {quote}
            </blockquote>
          ) : !isEdit ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm italic text-muted-foreground">
              This note is for the whole briefing.
            </p>
          ) : null}

          {!isEdit ? (
            <NoteAttachmentPicker
              attachments={attachments}
              onAdd={handleAddAttachment}
              onRemove={handleRemoveAttachment}
              disabled={saving}
              error={attachmentError}
            />
          ) : null}

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note…"
            rows={6}
            className="min-h-[160px] resize-none rounded-2xl"
          />
        </div>

        <div
          data-vaul-no-drag
          className="flex flex-col gap-2 border-t border-border bg-background px-4 py-3 lg:border-t-0"
        >
          <Button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="w-full"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save note'}
          </Button>
          {isEdit ? (
            <Button
              type="button"
              variant="link"
              disabled={saving}
              onClick={handleDelete}
              className="text-destructive"
            >
              Delete note
            </Button>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
