'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import {
  Button,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Textarea,
} from '@styleguide'
import { useBriefingFeedback } from '@shared/briefings/use-briefing-feedback'
import type { ArtifactFeedbackKind } from '@shared/briefings/feedback-api'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

type Props = {
  meetingDate: string
  itemId: string
}

const COMMENT_MAX_CHARS = 2000

export default function FeedbackRow({
  meetingDate,
  itemId,
}: Props): React.JSX.Element {
  const { feedbackByItemId, commentByItemId, setFeedback, clearFeedback } =
    useBriefingFeedback(meetingDate)
  const current = feedbackByItemId[itemId]

  // Composer state. Opens automatically when the user transitions INTO
  // 'negative' (so the optional "tell us why" prompt is right next to the
  // click). Stays closed otherwise — re-clicking the thumb toggles the
  // vote off, and clicking thumbs-up never opens the composer.
  const [composerOpen, setComposerOpen] = useState(false)
  const [draftComment, setDraftComment] = useState('')

  function vote(target: ArtifactFeedbackKind) {
    if (current === target) {
      clearFeedback(itemId)
      setComposerOpen(false)
      return
    }
    if (target === 'negative') {
      // Cast the vote immediately so the row reflects the user's choice
      // even if they dismiss the composer without saving.
      setFeedback(itemId, target)
      trackEvent(EVENTS.BriefingAssistant.FeedbackCompleted, {
        meetingDate,
        itemId,
        feedback: 'bad',
        comment: commentByItemId[itemId] ?? '',
      })
      // Prefill from any previously-stored comment so the user can edit
      // rather than retype. Empty string when there isn't one (also when
      // the row was just optimistically created).
      setDraftComment(commentByItemId[itemId] ?? '')
      setComposerOpen(true)
      return
    }
    // Switching to a thumbs-up clears any note left on a prior thumbs-down —
    // the "what was wrong" comment no longer applies once the rating flips
    // positive. Passing `null` tells the API to drop the stored comment.
    setFeedback(itemId, target, null)
    trackEvent(EVENTS.BriefingAssistant.FeedbackCompleted, {
      meetingDate,
      itemId,
      feedback: 'good',
      comment: '',
    })
  }

  function saveComment() {
    // Pass the trimmed string verbatim — empty string is a valid "clear"
    // signal but the user can still close without saving to keep what's
    // already stored.
    const trimmed = draftComment.trim()
    setFeedback(itemId, 'negative', trimmed.length === 0 ? null : trimmed)
    trackEvent(EVENTS.BriefingAssistant.FeedbackCompleted, {
      meetingDate,
      itemId,
      feedback: 'bad',
      comment: trimmed,
    })
    setComposerOpen(false)
  }

  function dismissComposer(nextOpen: boolean) {
    if (nextOpen) return
    setComposerOpen(false)
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
      <Popover open={composerOpen} onOpenChange={dismissComposer}>
        <PopoverAnchor asChild>
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
        </PopoverAnchor>
        <PopoverContent
          align="end"
          side="bottom"
          className="flex w-80 flex-col gap-3 p-4"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">
              What was wrong?
            </p>
            <p className="text-xs text-muted-foreground">
              Optional — your note helps us improve the briefing.
            </p>
          </div>
          <Textarea
            value={draftComment}
            onChange={(e) => setDraftComment(e.target.value)}
            placeholder="Tell us what was off…"
            rows={3}
            maxLength={COMMENT_MAX_CHARS}
            aria-label="Feedback comment"
            className="resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="link"
              size="small"
              onClick={() => setComposerOpen(false)}
            >
              Not now
            </Button>
            <Button type="button" size="small" onClick={saveComment}>
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
