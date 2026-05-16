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
import TypeIntake from './TypeIntake'
import NotePill, { type NotePillKind } from './NotePill'

const CAMERA_ACCEPT = 'image/*'
const UPLOAD_ACCEPT = '.pdf,.doc,.docx,.txt,image/*'
const MAX_BYTES = 20 * 1024 * 1024
const PILL_PREVIEW_CHARS = 32

type Section = 'camera' | 'upload' | 'typed'

export type StagedDraft =
  | { id: string; kind: 'typed'; body: string }
  | { id: string; kind: 'file'; file: File; from: 'camera' | 'upload' }

type Props = {
  open: boolean
  onClose: () => void
  /** Top-level notes already committed for this briefing. */
  existingNotes: Annotation[]
  /**
   * Commit every staged draft as its own note. Resolves when all writes
   * settle so the dialog can disable Submit while in flight.
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

type PillRow = {
  id: string
  kind: NotePillKind
  text: string
  busy?: boolean
  /** When true, X removes from the local staging buffer; otherwise it calls onDeleteExisting. */
  staged: boolean
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
 * Categorize an existing note into which intake card's pill list it should
 * appear under. Image attachments go to the Camera card, other attachments
 * go to Upload, body-only notes go to Type. The server doesn't remember
 * which intake method was used; mime type is the closest reliable proxy.
 */
const sectionForExisting = (ann: Annotation): Section => {
  const att = ann.note?.attachments?.[0]
  if (!att) return 'typed'
  if (att.mimeType.startsWith('image/')) return 'camera'
  return 'upload'
}

/**
 * Top-level "Add notes" intake. Pills inside the dialog represent every
 * top-level note that exists for this briefing (committed + currently
 * staged). Pills appear under the card that captured them — camera shots
 * under the camera card, files under the upload card, typed notes under
 * the type card. Each pill has an X to remove it.
 *
 * Submit commits each staged pill as its own note (typed → POST; file →
 * POST + presign + PUT + complete).
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
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [typeExpanded, setTypeExpanded] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const uploadInputRef = useRef<HTMLInputElement | null>(null)

  // While submitting, freeze the snapshot of existing-note IDs so newly
  // committed notes don't pop into the pill list mid-flight (they'd briefly
  // render as "(empty note)" until their attachment row catches up).
  const frozenExistingIdsRef = useRef<Set<string> | null>(null)

  // Auto-expand the Type card when the briefing already has typed notes —
  // the user wants to see / be able to add more without an extra click. For
  // briefings with no typed notes yet, the textarea + Dictate stay hidden
  // until the user explicitly taps the Type card.
  const hasExistingTypedNotes = useMemo(
    () =>
      existingNotes.some((ann) => {
        const att = ann.note?.attachments?.[0]
        return !att && (ann.note?.body ?? '').trim().length > 0
      }),
    [existingNotes],
  )

  useEffect(() => {
    if (open) {
      setTypedDraft('')
      setStaged([])
      setSubmitting(false)
      setFileError(null)
      setSubmitError(null)
      setTypeExpanded(hasExistingTypedNotes)
      frozenExistingIdsRef.current = null
    }
    // hasExistingTypedNotes is read once on open; if the briefing's notes
    // change while the dialog is open we don't want to clobber the user's
    // toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const trimmedDraft = typedDraft.trim()
  const canAddTyped = trimmedDraft.length > 0 && !submitting
  // Submit commits the staged pills plus any unstaged textarea text. "+ Add"
  // is still there for queueing multiple typed notes in one Submit, but it's
  // not required for the common "type one note, click Submit" case.
  const canSubmit =
    (staged.length > 0 || trimmedDraft.length > 0) && !submitting

  const visibleExisting = useMemo(() => {
    if (submitting && frozenExistingIdsRef.current) {
      const allowed = frozenExistingIdsRef.current
      return existingNotes.filter((a) => allowed.has(a.id))
    }
    return existingNotes
  }, [existingNotes, submitting])

  const pillsBySection = useMemo(() => {
    const out: Record<Section, PillRow[]> = {
      camera: [],
      upload: [],
      typed: [],
    }
    for (const ann of visibleExisting) {
      const section = sectionForExisting(ann)
      const att = ann.note?.attachments?.[0]
      const kind: NotePillKind =
        section === 'typed' ? 'typed' : section === 'camera' ? 'image' : 'file'
      const text = att ? att.fileName : (ann.note?.body ?? '(empty note)')
      out[section].push({
        id: ann.id,
        kind,
        text: truncate(text, PILL_PREVIEW_CHARS),
        busy: deletingIds?.has(ann.id) ?? false,
        staged: false,
      })
    }
    for (const d of staged) {
      if (d.kind === 'typed') {
        out.typed.push({
          id: d.id,
          kind: 'typed',
          text: truncate(d.body, PILL_PREVIEW_CHARS),
          staged: true,
        })
      } else {
        const section: Section = d.from
        out[section].push({
          id: d.id,
          kind: d.file.type.startsWith('image/') ? 'image' : 'file',
          text: truncate(d.file.name, PILL_PREVIEW_CHARS),
          staged: true,
        })
      }
    }
    return out
  }, [visibleExisting, staged, deletingIds])

  const removeStaged = (id: string) => {
    setStaged((prev) => prev.filter((d) => d.id !== id))
  }

  const handlePillDelete = (row: PillRow) => {
    if (row.staged) {
      removeStaged(row.id)
    } else {
      void onDeleteExisting(row.id)
    }
  }

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

  const handleSubmit = async () => {
    if (!canSubmit) return
    // Sweep any unstaged textarea content into the drafts list so the user
    // doesn't have to click "+ Add" before Submit for the single-note case.
    const drafts: StagedDraft[] = trimmedDraft.length
      ? [...staged, { id: newId(), kind: 'typed', body: trimmedDraft }]
      : staged
    frozenExistingIdsRef.current = new Set(existingNotes.map((a) => a.id))
    setSubmitError(null)
    setSubmitting(true)
    try {
      await onSubmit(drafts)
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setSubmitError(`Couldn't save your notes: ${msg}`)
    } finally {
      setSubmitting(false)
      frozenExistingIdsRef.current = null
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

  const renderPills = (rows: PillRow[]) =>
    rows.length === 0 ? null : (
      <div className="flex flex-wrap items-center gap-2">
        {rows.map((row) => (
          <NotePill
            key={`${row.staged ? 'staged' : 'existing'}-${row.id}`}
            kind={row.kind}
            text={row.text}
            busy={row.busy}
            onDelete={() => handlePillDelete(row)}
          />
        ))}
      </div>
    )

  // Card chrome (icon + title + description) is the click target; pills sit
  // below as siblings so their own X buttons don't nest inside the card
  // button (invalid HTML).
  const fileCard = (args: {
    onClick: () => void
    icon: typeof Camera
    title: string
    description: string
    pills: PillRow[]
  }) => (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <button
        type="button"
        onClick={args.onClick}
        disabled={submitting}
        className="-m-2 flex items-start gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
        >
          <args.icon className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">
            {args.title}
          </span>
          <span className="text-sm leading-5 text-muted-foreground">
            {args.description}
          </span>
        </span>
      </button>
      {renderPills(args.pills)}
    </div>
  )

  const cameraCard = fileCard({
    onClick: pickCamera,
    icon: Camera,
    title: 'Take a picture of my notes',
    description: 'Use your camera to scan handwritten notes',
    pills: pillsBySection.camera,
  })

  const uploadCard = fileCard({
    onClick: pickUpload,
    icon: FileText,
    title: 'Upload meeting minutes or note files',
    description: 'PDF, image, Word doc, or plain text',
    pills: pillsBySection.upload,
  })

  // Type card collapses to icon + title + description by default; clicking
  // the header expands it to reveal the textarea + Dictate + Add button.
  // Auto-expanded on open if the briefing already has typed notes.
  const typeCard = (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <button
        type="button"
        onClick={() => setTypeExpanded(true)}
        disabled={submitting || typeExpanded}
        className="-m-2 flex items-start gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:bg-transparent"
      >
        <span
          aria-hidden
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
        >
          <Pencil className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">
            Type, dictate or paste my notes
          </span>
          <span className="text-sm leading-5 text-muted-foreground">
            Type your notes, use dictation, or paste from app
          </span>
        </span>
      </button>

      {renderPills(pillsBySection.typed)}

      {typeExpanded ? (
        <>
          <TypeIntake
            body={typedDraft}
            onBodyChange={setTypedDraft}
            disabled={submitting}
          />
          <div>
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
        </>
      ) : null}
    </div>
  )

  const cards = (
    <div className="flex flex-col gap-3">
      {cameraCard}
      {uploadCard}
      {typeCard}

      {fileError ? (
        <p className="text-xs text-destructive">{fileError}</p>
      ) : null}
      {submitError ? (
        <p className="text-sm text-destructive">{submitError}</p>
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
