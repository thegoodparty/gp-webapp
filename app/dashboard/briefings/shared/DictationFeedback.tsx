'use client'

import type { UseDictationAppendResult } from './useDictationAppend'

type Props = {
  dictation: UseDictationAppendResult
}

export function DictationFeedback({ dictation }: Props): React.JSX.Element {
  return (
    <>
      {dictation.partialTranscript ? (
        <p aria-live="polite" className="text-xs italic text-muted-foreground">
          {dictation.partialTranscript}
        </p>
      ) : null}
      {dictation.error ? (
        <p role="alert" className="text-sm text-destructive">
          {dictation.error}
        </p>
      ) : null}
    </>
  )
}
