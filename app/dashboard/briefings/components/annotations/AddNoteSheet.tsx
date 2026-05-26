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
import { reportErrorToSentry } from '@shared/sentry'
import type { ResolvedAnchor } from '@shared/briefings/anchorResolver'
import type { SheetState } from './AnnotationsScope'
import type { PredictedPosition } from './enrichForCycler'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'
import { AnchoredQuote } from './AnchoredQuote'

type Props = {
  sheet: SheetState
  position: PredictedPosition | null
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
  position,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Reset body when the sheet transitions states.
  useEffect(() => {
    if (sheet.kind === 'add_note_edit') {
      setBody(sheet.annotation.note?.body ?? '')
    } else if (sheet.kind === 'add_note_new') {
      setBody('')
    }
    setErrorMessage(null)
  }, [sheet])

  // Clear the user's text selection once the drawer opens — leaving a live
  // selection blocks Vaul's drag-to-dismiss.
  useClearSelectionOnOpen(open)

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
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: isEdit ? 'updateNote' : 'create',
      })
      setErrorMessage("Couldn't save note. Try again.")
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
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-annotations',
        op: 'remove',
      })
      setErrorMessage("Couldn't delete note. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const canSave = body.trim().length > 0 && !saving

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
          className="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4"
        >
          {quote ? (
            <AnchoredQuote text={quote} showLabel={false} />
          ) : !isEdit ? (
            <p className="rounded-md bg-muted px-3 py-2 text-sm italic text-muted-foreground">
              This note is for the whole briefing.
            </p>
          ) : null}

          <Textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              if (errorMessage) setErrorMessage(null)
            }}
            placeholder="Write your note…"
            rows={6}
            className="min-h-[160px] resize-none rounded-2xl"
          />
        </div>

        <div
          data-vaul-no-drag
          className="flex flex-col gap-2 border-t border-border bg-background px-4 py-3 lg:border-t-0"
        >
          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
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
