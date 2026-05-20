'use client'

import { useEffect, useRef } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { Button, Textarea } from '@styleguide'
import { useDictation, type DictationStatus } from '../../shared/useDictation'

type Props = {
  body: string
  onBodyChange: (next: string) => void
  /**
   * Disables Dictate while parent is mid-Submit so partial transcripts don't
   * land after the dialog closes.
   */
  disabled?: boolean
}

const ACTIVE_STATUSES: ReadonlySet<DictationStatus> = new Set([
  'requesting_mic',
  'connecting',
  'recording',
  'stopping',
])

function dictateLabel(status: DictationStatus): string {
  switch (status) {
    case 'requesting_mic':
      return 'Allow mic…'
    case 'connecting':
      return 'Connecting…'
    case 'recording':
      return 'Stop'
    case 'stopping':
      return 'Stopping…'
    default:
      return 'Dictate'
  }
}

/**
 * The "Type, dictate or paste" intake editor. Renders inline under the option
 * cards once the user selects Type. Body is owned by the parent dialog so
 * Submit can read it.
 */
export default function TypeIntake({
  body,
  onBodyChange,
  disabled,
}: Props): React.JSX.Element {
  const bodyRef = useRef(body)
  bodyRef.current = body

  const dictation = useDictation({
    analyticsLabel: 'note_intake',
    onFinalTranscript: (text) => {
      if (!text) return
      const current = bodyRef.current
      const sep = current.length > 0 && !current.endsWith(' ') ? ' ' : ''
      onBodyChange(current + sep + text)
    },
  })

  // Best-effort stop dictation when this editor unmounts (dialog close).
  useEffect(() => {
    return () => {
      if (ACTIVE_STATUSES.has(dictation.status)) {
        void dictation.stop()
      }
    }
    // We intentionally only run cleanup on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isActive = ACTIVE_STATUSES.has(dictation.status)
  const dictating = dictation.status === 'recording'

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Your notes
        </span>
        <Button
          type="button"
          variant="outline"
          size="small"
          disabled={disabled || dictation.status === 'stopping'}
          onClick={() => {
            if (isActive) {
              void dictation.stop()
            } else {
              void dictation.start()
            }
          }}
        >
          {dictating ? (
            <Square className="size-4" aria-hidden />
          ) : dictation.status === 'connecting' ||
            dictation.status === 'requesting_mic' ||
            dictation.status === 'stopping' ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Mic className="size-4" aria-hidden />
          )}
          {dictateLabel(dictation.status)}
        </Button>
      </div>

      <Textarea
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        placeholder="What happened? Key votes, what you said, who pushed back, what surprised you. Bullet points are fine."
        rows={6}
        disabled={disabled}
        className="resize-y"
      />

      {dictation.partialTranscript ? (
        <p className="text-xs italic text-muted-foreground">
          {dictation.partialTranscript}
        </p>
      ) : null}

      {dictation.warningSecondsRemaining !== null ? (
        <p className="text-xs text-amber-700">
          Dictation will time out in {dictation.warningSecondsRemaining}s.
        </p>
      ) : null}

      {dictation.error ? (
        <p className="text-xs text-destructive">{dictation.error}</p>
      ) : null}
    </div>
  )
}
