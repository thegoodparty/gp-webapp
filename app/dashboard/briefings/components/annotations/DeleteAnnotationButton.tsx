'use client'

import { useState } from 'react'
import { Button, Trash2Icon } from '@styleguide'
import type { Annotation } from '@shared/briefings/types'
import type { EnrichedAnnotation } from './enrichForCycler'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'

interface Props {
  /**
   * The annotation currently focused by the cycler. When null, the button
   * renders nothing — keeps the surface footer empty in the empty state
   * and during transitions.
   */
  current: EnrichedAnnotation | null
  /** Visible button label, e.g. "Delete note" / "Delete chat". */
  label: string
  /** Dialog heading, e.g. "Delete this note?". */
  title: string
  /** Dialog body copy. */
  description: string
  /**
   * Awaitable delete callback. The dialog stays open while the returned
   * promise is pending; on rejection the error is surfaced inline and the
   * user can retry without reopening the dialog.
   */
  onDelete: (annotation: Annotation) => Promise<void>
  /**
   * When true, the outer Delete trigger is disabled — typically set while
   * the surface is mid-stream (chat sending) so the user can't yank the
   * annotation out from under an in-flight network call.
   */
  disabled?: boolean
}

/**
 * Shared destructive-action trigger for the briefing cycler surfaces.
 * Encapsulates the pendingDelete/deleting/errorMessage state machine so the
 * three surfaces (notes, chats, bug reports) don't duplicate it. The
 * dialog stays open during the in-flight mutation and surfaces failures
 * inline rather than swallowing them.
 */
export function DeleteAnnotationButton({
  current,
  label,
  title,
  description,
  onDelete,
  disabled = false,
}: Props): React.JSX.Element | null {
  const [pendingDelete, setPendingDelete] = useState<EnrichedAnnotation | null>(
    null,
  )
  const [deleting, setDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!current) return null

  const handleConfirm = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    setErrorMessage(null)
    try {
      await onDelete(pendingDelete)
      setPendingDelete(null)
    } catch {
      setErrorMessage("Couldn't delete. Try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="small"
        onClick={() => {
          setErrorMessage(null)
          setPendingDelete(current)
        }}
        disabled={disabled}
        className="w-full gap-2 border-transparent bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2Icon className="size-4" aria-hidden="true" />
        {label}
      </Button>
      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) {
            setPendingDelete(null)
            setErrorMessage(null)
          }
        }}
        title={title}
        description={description}
        confirming={deleting}
        errorMessage={errorMessage}
        onConfirm={() => {
          void handleConfirm()
        }}
      />
    </>
  )
}
