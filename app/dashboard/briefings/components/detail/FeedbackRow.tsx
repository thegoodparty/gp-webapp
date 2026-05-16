'use client'

import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { IconButton } from '@styleguide'
import { useBriefingFeedback } from '@shared/briefings/use-briefing-feedback'
import type { ArtifactFeedbackKind } from '@shared/briefings/feedback-api'

type Props = {
  meetingDate: string
  itemId: string
}

export default function FeedbackRow({
  meetingDate,
  itemId,
}: Props): React.JSX.Element {
  const { feedbackByItemId, setFeedback, clearFeedback } =
    useBriefingFeedback(meetingDate)
  const current = feedbackByItemId[itemId]

  function vote(target: ArtifactFeedbackKind) {
    if (current === target) {
      clearFeedback(itemId)
    } else {
      setFeedback(itemId, target)
    }
  }

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
        aria-pressed={current === 'positive'}
        onClick={() => vote('positive')}
        className={
          current === 'positive'
            ? 'text-success-600 hover:text-success-600'
            : 'text-muted-foreground hover:text-foreground'
        }
      >
        <ThumbsUp className="size-4" aria-hidden />
      </IconButton>
      <IconButton
        type="button"
        size="small"
        variant="ghost"
        aria-label="No"
        aria-pressed={current === 'negative'}
        onClick={() => vote('negative')}
        className={
          current === 'negative'
            ? 'text-destructive hover:text-destructive'
            : 'text-muted-foreground hover:text-foreground'
        }
      >
        <ThumbsDown className="size-4" aria-hidden />
      </IconButton>
    </div>
  )
}
