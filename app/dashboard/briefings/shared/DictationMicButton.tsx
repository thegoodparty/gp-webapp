'use client'

import { cn, IconButton, Loader2Icon, MicIcon, SquareIcon } from '@styleguide'
import type { UseDictationAppendResult } from './useDictationAppend'

type Props = {
  dictation: UseDictationAppendResult
  idleLabel: string
  recordingLabel: string
  /** Caller-level disable (e.g. parent is saving). Hook-level busy is handled internally. */
  disabled?: boolean
  /** Overrides the default `absolute bottom-2 right-2` placement. */
  className?: string
}

const DEFAULT_PLACEMENT = 'absolute bottom-2 right-2'

export function DictationMicButton({
  dictation,
  idleLabel,
  recordingLabel,
  disabled,
  className,
}: Props): React.JSX.Element {
  const isRecording = dictation.status === 'recording'
  const label = isRecording ? recordingLabel : idleLabel
  return (
    <IconButton
      type="button"
      variant="ghost"
      size="small"
      aria-label={label}
      disabled={disabled || dictation.status === 'stopping'}
      onClick={() => {
        void dictation.toggle()
      }}
      className={cn(DEFAULT_PLACEMENT, className)}
    >
      {dictation.busy ? (
        <Loader2Icon className="size-4 animate-spin" aria-hidden />
      ) : isRecording ? (
        <SquareIcon className="size-4" aria-hidden />
      ) : (
        <MicIcon className="size-4" aria-hidden />
      )}
    </IconButton>
  )
}
