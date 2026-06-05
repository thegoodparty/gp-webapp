'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button, Input, Link2Icon, UploadIcon } from '@styleguide'

type Props = {
  /** Meeting this packet is for, when launched from an awaiting-agenda row. */
  meetingName?: string
  meetingSlug?: string
  /** Called after a successful submit so a hosting dialog can close itself. */
  onSubmitted?: () => void
}

const ACCEPT = '.pdf,.doc,.docx,.txt,image/*'

/**
 * Lets a user kick off a briefing from their own agenda packet — either by
 * pasting a link to the packet or uploading the file directly. Reused inline
 * in the briefings empty state and inside the awaiting-agenda dialog.
 *
 * PROTOTYPE: the submit is not wired to gp-api yet. It simulates the dispatch
 * so the flow is clickable end-to-end. Real wiring is a POST to
 * /v1/meetings/briefings/dispatch carrying `agendaPacketUrl` (link) or a
 * presigned-upload key (file) — the agent already accepts both and emits
 * `briefing_status: "agenda_provided_by_user"`.
 */
export default function AgendaUploadBlock({
  meetingSlug,
  onSubmitted,
}: Props): React.JSX.Element {
  const [link, setLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const canSubmit = (link.trim().length > 0 || file !== null) && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    const viaLink = link.trim().length > 0
    void meetingSlug
    toast.loading(
      viaLink
        ? 'Fetching the meeting packet from the link you provided…'
        : `Uploading ${file?.name ?? 'your meeting packet'}…`,
      { id: 'agenda-upload' },
    )
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success('Generating your briefing', {
      id: 'agenda-upload',
      description:
        "We'll email you the moment it's ready — usually within a few minutes.",
    })
    setSubmitting(false)
    setLink('')
    setFile(null)
    onSubmitted?.()
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-center text-sm text-muted-foreground">
        Drop in a link to the meeting packet, or upload the file. We&apos;ll
        handle the rest.
      </p>

      <Input
        type="url"
        inputMode="url"
        icon={<Link2Icon aria-hidden />}
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste a link to the meeting packet"
        disabled={submitting}
        className="rounded-full"
      />

      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 truncate rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UploadIcon className="size-4 shrink-0" aria-hidden />
        <span className="truncate">
          {file ? file.name : 'Upload the meeting packet'}
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null)
          e.target.value = ''
        }}
      />

      <Button
        type="button"
        className="w-full rounded-full"
        disabled={!canSubmit}
        onClick={() => void handleSubmit()}
      >
        {submitting ? 'Getting your briefing…' : 'Get your briefing'}
      </Button>
    </div>
  )
}
