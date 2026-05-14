'use client'
import { LuMic, LuMicOff } from 'react-icons/lu'
import { useDictation } from './useDictation'

const FEATURE_FLAG_ENABLED =
  process.env.NEXT_PUBLIC_DICTATION_DEMO_ENABLED === 'true'

type DictationDemoWidgetProps = {
  targetId: string
}

export default function DictationDemoWidget({
  targetId,
}: DictationDemoWidgetProps) {
  const dictation = useDictation({
    target: { type: 'note', id: targetId },
  })

  if (!FEATURE_FLAG_ENABLED) {
    return null
  }

  const isActive =
    dictation.status === 'recording' ||
    dictation.status === 'connecting' ||
    dictation.status === 'requesting_mic' ||
    dictation.status === 'stopping'

  const buttonLabel =
    dictation.status === 'requesting_mic'
      ? 'Requesting mic\u2026'
      : dictation.status === 'connecting'
      ? 'Connecting\u2026'
      : dictation.status === 'recording'
      ? 'Stop dictation'
      : dictation.status === 'stopping'
      ? 'Stopping\u2026'
      : 'Dictate'

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">Dictation demo</h3>
        <button
          type="button"
          onClick={() => {
            if (isActive) {
              void dictation.stop()
            } else {
              void dictation.start()
            }
          }}
          disabled={
            dictation.status === 'requesting_mic' ||
            dictation.status === 'connecting' ||
            dictation.status === 'stopping'
          }
          className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground bg-background px-4 h-9 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isActive ? (
            <LuMicOff className="h-4 w-4" />
          ) : (
            <LuMic className="h-4 w-4" />
          )}
          {buttonLabel}
        </button>
      </div>
      {dictation.warningSecondsRemaining !== null ? (
        <p className="text-xs text-warning-600 mb-2">
          Recording will stop in {dictation.warningSecondsRemaining} seconds.
        </p>
      ) : null}
      {dictation.error ? (
        <p className="text-xs text-destructive mb-2">{dictation.error}</p>
      ) : null}
      <div className="min-h-[3rem] rounded-md bg-muted px-3 py-2 text-sm">
        {dictation.transcript || (
          <span className="text-muted-foreground">
            {isActive
              ? 'Listening\u2026 speak into your microphone.'
              : 'Press Dictate to start.'}
          </span>
        )}
        {dictation.partialTranscript ? (
          <span className="text-muted-foreground">
            {dictation.transcript ? ' ' : ''}
            {dictation.partialTranscript}
          </span>
        ) : null}
      </div>
    </div>
  )
}
