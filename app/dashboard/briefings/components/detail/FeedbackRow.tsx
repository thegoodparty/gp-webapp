'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

type Vote = 'up' | 'down' | null

/**
 * "Was this summary helpful?" thumbs feedback at the bottom of an agenda
 * item card. Local state only in v1; no persistence.
 */
export default function FeedbackRow(): React.JSX.Element {
  const [vote, setVote] = useState<Vote>(null)
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        Was this summary helpful?
      </span>
      <button
        type="button"
        aria-label="Yes"
        aria-pressed={vote === 'up'}
        onClick={() => setVote((v) => (v === 'up' ? null : 'up'))}
        className={`inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted/60 ${
          vote === 'up' ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
      >
        <ThumbsUp className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="No"
        aria-pressed={vote === 'down'}
        onClick={() => setVote((v) => (v === 'down' ? null : 'down'))}
        className={`inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted/60 ${
          vote === 'down' ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
      >
        <ThumbsDown className="size-4" aria-hidden />
      </button>
    </div>
  )
}
