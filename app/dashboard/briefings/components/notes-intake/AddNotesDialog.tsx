'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { Camera, FileText, Pencil, X } from 'lucide-react'
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

export type IntakeSubmit =
  | { kind: 'typed'; body: string }
  | { kind: 'file'; file: File }

type Props = {
  open: boolean
  onClose: () => void
  /**
   * Submits one intake — either a typed note body or a single file. Resolves
   * once the underlying server work is committed so the dialog can disable
   * Submit while in flight.
   */
  onSubmit: (input: IntakeSubmit) => Promise<void> | void
}

const CAMERA_ACCEPT = 'image/*'
const UPLOAD_ACCEPT = '.pdf,.doc,.docx,.txt,image/*'
const MAX_BYTES = 20 * 1024 * 1024

const formatBytes = (n: number): string => {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Top-level "Add notes" intake. Per decision 2 of the intake plan, one note
 * per Submit. Camera and Upload pop the device picker; the resulting file is
 * staged in dialog state and committed on Submit.
 *
 * Desktop / tablet (≥ md): Radix Dialog, centered.
 * Mobile (< md): Sheet from the bottom, swipe-to-dismiss per styleguide
 * defaults.
 */
export default function AddNotesDialog({
  open,
  onClose,
  onSubmit,
}: Props): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [method, setMethod] = useState<Method | null>(null)
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const uploadInputRef = useRef<HTMLInputElement | null>(null)

  // Reset state every time the dialog opens.
  useEffect(() => {
    if (open) {
      setMethod(null)
      setBody('')
      setFile(null)
      setFileError(null)
      setSubmitting(false)
    }
  }, [open])

  const trimmed = body.trim()
  const canSubmit =
    !submitting &&
    ((method === 'type' && trimmed.length > 0) ||
      ((method === 'camera' || method === 'upload') && file !== null))

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      if (method === 'type') {
        await onSubmit({ kind: 'typed', body: trimmed })
      } else if (file) {
        await onSubmit({ kind: 'file', file })
      }
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next && !submitting) onClose()
  }

  const acceptFile = (next: File | null) => {
    setFileError(null)
    if (!next) {
      setFile(null)
      return
    }
    if (next.size > MAX_BYTES) {
      setFileError(
        `File too large. Max 20 MB; ${formatBytes(next.size)} given.`,
      )
      setFile(null)
      return
    }
    setFile(next)
  }

  const pickCamera = () => {
    setMethod('camera')
    setFile(null)
    cameraInputRef.current?.click()
  }
  const pickUpload = () => {
    setMethod('upload')
    setFile(null)
    uploadInputRef.current?.click()
  }
  const pickType = () => {
    setMethod('type')
    setFile(null)
    setFileError(null)
  }

  const filePreview =
    (method === 'camera' || method === 'upload') && file ? (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)} · {file.type || 'unknown type'}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="small"
          onClick={() => acceptFile(null)}
          disabled={submitting}
          aria-label="Remove file"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
    ) : null

  const fileErrorBlock =
    fileError && (method === 'camera' || method === 'upload') ? (
      <p className="text-xs text-destructive">{fileError}</p>
    ) : null

  const cards = (
    <div className="flex flex-col gap-3">
      <IntakeOptionCard
        icon={Camera}
        title="Take a picture of my notes"
        description="Use your camera to scan handwritten notes"
        selected={method === 'camera'}
        onClick={pickCamera}
      />
      <IntakeOptionCard
        icon={FileText}
        title="Upload meeting minutes or note files"
        description="PDF, image, Word doc, or plain text"
        selected={method === 'upload'}
        onClick={pickUpload}
      />
      <IntakeOptionCard
        icon={Pencil}
        title="Type, dictate or paste my notes"
        description="Type your notes, use dictation, or paste from app"
        selected={method === 'type'}
        onClick={pickType}
      />

      {method === 'type' ? (
        <TypeIntake body={body} onBodyChange={setBody} disabled={submitting} />
      ) : null}
      {filePreview}
      {fileErrorBlock}

      <input
        ref={cameraInputRef}
        type="file"
        accept={CAMERA_ACCEPT}
        capture="environment"
        className="hidden"
        onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        className="hidden"
        onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
      />
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
