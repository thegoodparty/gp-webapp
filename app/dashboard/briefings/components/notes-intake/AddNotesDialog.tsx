'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { Camera, FileText, Pencil, Plus } from 'lucide-react'
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
import type { Annotation } from '@shared/briefings/types'
import IntakeOptionCard from './IntakeOptionCard'
import TypeIntake from './TypeIntake'
import NotePill, { type NotePillKind } from './NotePill'

const CAMERA_ACCEPT = 'image/*'
const UPLOAD_ACCEPT = '.pdf,.doc,.docx,.txt,image/*'
const MAX_BYTES = 20 * 1024 * 1024
const PILL_PREVIEW_CHARS = 32

export type StagedDraft =
  | { id: string; kind: 'typed'; body: string }
  | { id: string; kind: 'file'; file: File; from: 'camera' | 'upload' }

type Props = {
  open: boolean
  onClose: () => void
  /**
   * Top-level notes already committed for this briefing. Rendered as
   * existing pills with X-delete.
   */
  existingNotes: Annotation[]
  /**
   * Commit all currently-staged drafts as new notes. Resolves once every
   * draft is server-side.
   */
  onSubmit: (drafts: StagedDraft[]) => Promise<void> | void
  /**
   * Delete one previously-committed note. The pill spinner is driven by
   * `deletingIds`.
   */
  onDeleteExisting: (annotationId: string) => Promise<void> | void
  /** Set of annotation ids currently being deleted (spinner on pill). */
  deletingIds?: Set<string>
}

const formatBytes = (n: number): string => {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/**
 * Top-level "Add notes" intake. Pills inside the dialog represent every
 * top-level note that exists for this briefing (committed + currently
 * staged). Each pill has an X to remove it. The pills are the only place
 * top-level notes are visible in the UI.
 *
 * Flow:
 *   - Type method: type → "Add note" → pill stages locally
 *   - Camera method: tap card → device camera → captured image stages locally
 *   - Upload method: tap card → file picker → selected file stages locally
 *   - Submit: commits every staged pill (one note per pill); each file pill
 *     creates a note then runs presign → PUT → complete
 *
 * Desktop / tablet (≥ md): Radix Dialog, centered.
 * Mobile (< md): Sheet from the bottom, swipe-to-dismiss.
 */
export default function AddNotesDialog({
  open,
  onClose,
  existingNotes,
  onSubmit,
  onDeleteExisting,
  deletingIds,
}: Props): React.JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [typedDraft, setTypedDraft] = useState('')
  const [staged, setStaged] = useState<StagedDraft[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const uploadInputRef = useRef<HTMLInputElement | null>(null)

  // Reset local state whenever the dialog opens.
  useEffect(() => {
    if (open) {
      setTypedDraft('')
      setStaged([])
      setSubmitting(false)
      setFileError(null)
    }
  }, [open])

  const trimmedDraft = typedDraft.trim()
  const canAddTyped = trimmedDraft.length > 0 && !submitting
  const canSubmit = staged.length > 0 && !submitting

  const existingPills = useMemo(() => {
    return existingNotes.map((ann) => {
      const att = ann.note?.attachments?.[0]
      let kind: NotePillKind = 'typed'
      let text = ''
      if (att) {
        kind = att.mimeType.startsWith('image/') ? 'image' : 'file'
        text = att.fileName
      } else {
        text = ann.note?.body ?? '(empty note)'
      }
      return {
        id: ann.id,
        kind,
        text: truncate(text, PILL_PREVIEW_CHARS),
        busy: deletingIds?.has(ann.id) ?? false,
      }
    })
  }, [existingNotes, deletingIds])

  const stagedPills = useMemo(() => {
    return staged.map((d) => {
      if (d.kind === 'typed') {
        return {
          id: d.id,
          kind: 'typed' as NotePillKind,
          text: truncate(d.body, PILL_PREVIEW_CHARS),
        }
      }
      return {
        id: d.id,
        kind: (d.file.type.startsWith('image/')
          ? 'image'
          : 'file') as NotePillKind,
        text: truncate(d.file.name, PILL_PREVIEW_CHARS),
      }
    })
  }, [staged])

  const handleAddTyped = () => {
    if (!canAddTyped) return
    setStaged((prev) => [
      ...prev,
      { id: newId(), kind: 'typed', body: trimmedDraft },
    ])
    setTypedDraft('')
  }

  const handlePickedFile = (file: File | null, from: 'camera' | 'upload') => {
    setFileError(null)
    if (!file) return
    if (file.size > MAX_BYTES) {
      setFileError(
        `File too large. Max 20 MB; ${formatBytes(file.size)} given.`,
      )
      return
    }
    setStaged((prev) => [...prev, { id: newId(), kind: 'file', file, from }])
  }

  const removeStaged = (id: string) => {
    setStaged((prev) => prev.filter((d) => d.id !== id))
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await onSubmit(staged)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next && !submitting) onClose()
  }

  const pickCamera = () => {
    if (submitting) return
    cameraInputRef.current?.click()
  }
  const pickUpload = () => {
    if (submitting) return
    uploadInputRef.current?.click()
  }

  const allPills = (
    <>
      {existingPills.length === 0 && stagedPills.length === 0 ? null : (
        <div className="flex flex-wrap items-center gap-2">
          {existingPills.map((p) => (
            <NotePill
              key={`existing-${p.id}`}
              kind={p.kind}
              text={p.text}
              busy={p.busy}
              onDelete={() => {
                void onDeleteExisting(p.id)
              }}
            />
          ))}
          {stagedPills.map((p) => (
            <NotePill
              key={`staged-${p.id}`}
              kind={p.kind}
              text={p.text}
              onDelete={() => removeStaged(p.id)}
            />
          ))}
        </div>
      )}
    </>
  )

  const typeCard = (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <header className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
        >
          <Pencil className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">
            Type, dictate or paste my notes
          </span>
          <span className="text-sm leading-5 text-muted-foreground">
            Type your notes, use dictation, or paste from app
          </span>
        </div>
      </header>

      <TypeIntake
        body={typedDraft}
        onBodyChange={setTypedDraft}
        disabled={submitting}
      />

      <div className="flex flex-wrap items-center gap-2">
        {allPills}
        <Button
          type="button"
          variant="outline"
          size="small"
          onClick={handleAddTyped}
          disabled={!canAddTyped}
          className="border-dashed"
        >
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
      </div>
    </div>
  )

  const cards = (
    <div className="flex flex-col gap-3">
      <IntakeOptionCard
        icon={Camera}
        title="Take a picture of my notes"
        description="Use your camera to scan handwritten notes"
        selected={false}
        onClick={pickCamera}
      />
      <IntakeOptionCard
        icon={FileText}
        title="Upload meeting minutes or note files"
        description="PDF, image, Word doc, or plain text"
        selected={false}
        onClick={pickUpload}
      />
      {typeCard}

      {fileError ? (
        <p className="text-xs text-destructive">{fileError}</p>
      ) : null}

      <input
        ref={cameraInputRef}
        type="file"
        accept={CAMERA_ACCEPT}
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handlePickedFile(e.target.files?.[0] ?? null, 'camera')
          e.target.value = ''
        }}
      />
      <input
        ref={uploadInputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        className="hidden"
        onChange={(e) => {
          handlePickedFile(e.target.files?.[0] ?? null, 'upload')
          e.target.value = ''
        }}
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
