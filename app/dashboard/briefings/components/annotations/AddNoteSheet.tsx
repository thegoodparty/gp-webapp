'use client'

import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@styleguide'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'
import type { SheetState } from './AnnotationsScope'

type Props = {
  sheet: SheetState
  onClose: () => void
  onCreate: (
    anchor: ResolvedAnchor | null,
    body: string,
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

  const initialBody =
    sheet.kind === 'add_note_edit' ? sheet.annotation.note?.body ?? '' : ''
  const [body, setBody] = useState(initialBody)
  const [saving, setSaving] = useState(false)

  // Reset body when the sheet transitions states.
  useEffect(() => {
    if (sheet.kind === 'add_note_edit') {
      setBody(sheet.annotation.note?.body ?? '')
    } else if (sheet.kind === 'add_note_new') {
      setBody('')
    }
  }, [sheet])

  const quote = quoteFor(sheet)
  const isEdit = sheet.kind === 'add_note_edit'

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      if (sheet.kind === 'add_note_edit') {
        await onUpdate(sheet.annotation.id, body)
      } else if (sheet.kind === 'add_note_new') {
        await onCreate(sheet.anchor, body)
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

  const canSave = body.trim().length > 0 && !saving

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <SheetContent
        side="right"
        onPointerDownOutside={() => onClose()}
        onEscapeKeyDown={() => onClose()}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
      >
        <SheetHeader className="px-6 pb-4 pr-12 pt-6">
          <SheetTitle className="text-2xl font-semibold tracking-tight text-foreground">
            {isEdit ? 'Edit note' : 'Add a Note'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
          {quote ? (
            <blockquote className="rounded-md bg-muted px-3 py-2 text-sm italic text-foreground">
              &ldquo;{quote}&rdquo;
            </blockquote>
          ) : !isEdit ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm italic text-muted-foreground">
              This note is for the whole briefing.
            </p>
          ) : null}

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note…"
            rows={6}
            className="min-h-[160px] w-full resize-none rounded-2xl border border-input bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-border bg-background px-4 py-3 lg:border-t-0">
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save note'}
          </button>
          {isEdit ? (
            <button
              type="button"
              disabled={saving}
              onClick={handleDelete}
              className="inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-sm font-medium text-destructive hover:underline disabled:pointer-events-none disabled:opacity-50"
            >
              Delete note
            </button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
