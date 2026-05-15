'use client'

import { useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { Camera, FileText, Pencil } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@styleguide'
import IntakeOptionCard from './IntakeOptionCard'
import TypeIntake from './TypeIntake'

type Method = 'camera' | 'upload' | 'type'

type Props = {
  open: boolean
  onClose: () => void
  /**
   * Commits a typed note. Resolves when the underlying mutation settles so
   * the dialog can disable Submit while in flight.
   */
  onSubmitTypedNote: (body: string) => Promise<void> | void
}

/**
 * Top-level "Add notes" intake. Phase 1: only the Type method is wired.
 * Camera and Upload render as "Coming soon" placeholders.
 *
 * Desktop / tablet (≥ md): Radix Dialog, centered.
 * Mobile (< md): Sheet from the bottom, swipe-to-dismiss per styleguide
 * defaults.
 */
export default function AddNotesDialog({
  open,
  onClose,
  onSubmitTypedNote,
}: Props): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [method, setMethod] = useState<Method | null>(null)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Reset state every time the dialog opens.
  useEffect(() => {
    if (open) {
      setMethod(null)
      setBody('')
      setSubmitting(false)
    }
  }, [open])

  const trimmed = body.trim()
  const canSubmit = method === 'type' && trimmed.length > 0 && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await onSubmitTypedNote(trimmed)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next && !submitting) onClose()
  }

  const cards = (
    <div className="flex flex-col gap-3">
      <IntakeOptionCard
        icon={Camera}
        title="Take a picture of my notes"
        description="Use your camera to scan handwritten notes"
        selected={method === 'camera'}
        disabled
        disabledHint="Camera capture ships in the next phase"
        onClick={() => setMethod('camera')}
      />
      <IntakeOptionCard
        icon={FileText}
        title="Upload meeting minutes or note files"
        description="PDF, image, Word doc, or plain text"
        selected={method === 'upload'}
        disabled
        disabledHint="File upload ships in the next phase"
        onClick={() => setMethod('upload')}
      />
      <IntakeOptionCard
        icon={Pencil}
        title="Type, dictate or paste my notes"
        description="Type your notes, use dictation, or paste from app"
        selected={method === 'type'}
        onClick={() => setMethod('type')}
      />

      {method === 'type' ? (
        <TypeIntake body={body} onBodyChange={setBody} disabled={submitting} />
      ) : null}
    </div>
  )

  const footer = (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={submitting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!canSubmit}
      >
        {submitting ? 'Submitting…' : 'Submit'}
      </Button>
    </>
  )

  const title = 'Add notes'
  const description =
    'Capture meeting notes, photos or files. We use them to draft your recap.'

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {cards}
          <DialogFooter>{footer}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-4">{cards}</div>
        <SheetFooter className="mt-4 flex-row justify-end gap-2 sm:justify-end">
          {footer}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
