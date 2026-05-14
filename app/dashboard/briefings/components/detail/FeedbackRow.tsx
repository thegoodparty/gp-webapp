'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { IconButton } from '@styleguide'

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
      <IconButton
        type="button"
        size="small"
        variant="ghost"
        aria-label="Yes"
        aria-pressed={vote === 'up'}
        onClick={() => setVote((v) => (v === 'up' ? null : 'up'))}
        className={
          vote === 'up' ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }
      >
        <ThumbsUp className="size-4" aria-hidden />
      </IconButton>
      <IconButton
        type="button"
        size="small"
        variant="ghost"
        aria-label="No"
        aria-pressed={vote === 'down'}
        onClick={() => setVote((v) => (v === 'down' ? null : 'down'))}
        className={
          vote === 'down' ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }
      >
        <ThumbsDown className="size-4" aria-hidden />
      </IconButton>
    </div>
  )
}
