'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { LinkIcon, UploadIcon } from '@styleguide'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@styleguide'
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput'
import {
  AgendaFileTooLargeError,
  AgendaFileWrongTypeError,
  MAX_AGENDA_BYTES,
  submitAgendaFile,
  submitAgendaUrl,
} from '@shared/briefings/agenda-upload-api'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  meetingDate: string
  meetingName: string
}

const MAX_MB = Math.round(MAX_AGENDA_BYTES / 1024 / 1024)

const isLikelyValidUrl = (value: string): boolean => {
  try {
    const u = new URL(value.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export default function UploadAgendaModal({
  open,
  onOpenChange,
  meetingDate,
  meetingName,
}: Props): React.JSX.Element {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reset = () => {
    setUrl('')
    setFile(null)
    setErrorMessage(null)
    // Native file inputs retain their selected value across re-opens, which
    // blocks re-selecting the same PDF after the user closes the modal. Clear
    // the DOM value so the next selection — even of the same file — fires
    // the change handler.
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const handleUrlChange = (next: string) => {
    setUrl(next)
    if (next && file) setFile(null)
    if (errorMessage) setErrorMessage(null)
  }

  const handleFileSelected = (chosen: File) => {
    setErrorMessage(null)
    const sizeMb = chosen.size / 1024 / 1024
    // Clear any previously-accepted file before validating the new one —
    // otherwise the upload button keeps showing the old filename and
    // submit stays enabled with the OLD file while we render an error
    // about the NEW one.
    if (chosen.type && chosen.type !== 'application/pdf') {
      setFile(null)
      setErrorMessage('That file isn’t a PDF. Please upload a PDF.')
      return
    }
    if (chosen.size > MAX_AGENDA_BYTES) {
      setFile(null)
      setErrorMessage(
        `That file is ${sizeMb.toFixed(1)} MB. Max size is ${MAX_MB} MB.`,
      )
      return
    }
    setFile(chosen)
    if (url) setUrl('')
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (file) return submitAgendaFile(meetingDate, file)
      if (url) return submitAgendaUrl(meetingDate, url.trim())
      throw new Error('no_input_provided')
    },
    onSuccess: () => {
      handleOpenChange(false)
      router.refresh()
    },
    onError: (err) => {
      if (err instanceof AgendaFileTooLargeError) {
        setErrorMessage(`File is too large. Max size is ${MAX_MB} MB.`)
        return
      }
      if (err instanceof AgendaFileWrongTypeError) {
        setErrorMessage('Only PDF files are supported.')
        return
      }
      setErrorMessage(
        'Something went wrong submitting your agenda. Please try again.',
      )
    },
  })

  const urlIsValid = url.trim().length > 0 && isLikelyValidUrl(url)
  const canSubmit = !submitMutation.isPending && (urlIsValid || file !== null)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-5 rounded-2xl p-6 sm:p-7">
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-xl font-bold leading-7">
            {meetingName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Drop in a link to the meeting packet, or upload the file. We&apos;ll
            handle the rest.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <label className="sr-only" htmlFor="agenda-url">
            Meeting packet URL
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <LinkIcon className="size-4" aria-hidden />
            </span>
            <input
              id="agenda-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste a link to the meeting packet"
              disabled={submitMutation.isPending}
              className="h-12 w-full rounded-full border border-base-border bg-transparent pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden />
            <span>OR</span>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={openFilePicker}
            disabled={submitMutation.isPending}
            className="h-12 w-full"
          >
            <Upload className="size-4 shrink-0" aria-hidden />
            <span className="truncate">
              {file ? file.name : 'Upload the meeting packet'}
            </span>
          </Button>

          <HiddenFileUploadInput
            ref={fileInputRef}
            accept="application/pdf"
            onChange={handleFileSelected}
          />

          {errorMessage ? (
            <p
              role="alert"
              className="text-sm text-destructive"
              data-testid="upload-agenda-error"
            >
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="button"
            className="w-full"
            disabled={!canSubmit}
            loading={submitMutation.isPending}
            loadingText="Submitting..."
            onClick={() => submitMutation.mutate()}
          >
            Get your briefing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
