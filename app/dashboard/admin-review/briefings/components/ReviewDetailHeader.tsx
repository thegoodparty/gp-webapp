'use client'

import Link from 'next/link'
import { ArrowLeftIcon, Button, MessageSquareIcon } from '@styleguide'
import { briefingsLandingHref } from '@shared/briefings/routes'
import { formatBriefingMeetingDate } from '@shared/briefings/dateHelpers'
import type { Briefing } from '@shared/briefings/types'
import { useReviewAnnotationsCtx } from '@shared/annotations/review/ReviewAnnotationsScope'

type Props = {
  briefing: Briefing
}

/**
 * Review-mode sticky header. Mirrors DetailHeader's layout (back arrow +
 * three-line title block) but swaps the candidate-facing Share / Read aloud
 * actions for a single "Add review comment" affordance. Built as a separate
 * variant rather than threading a mode flag through DetailHeader.
 */
export default function ReviewDetailHeader({
  briefing,
}: Props): React.JSX.Element {
  const formattedDate = formatBriefingMeetingDate(briefing.meeting_date)
  const { openReviewsSurface, reviewsCount } = useReviewAnnotationsCtx()
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-sidebar">
      <div className="mx-auto flex w-full max-w-[1120px] items-start gap-3 px-4 py-4 lg:px-8">
        <Link
          href={briefingsLandingHref()}
          aria-label="Back to meetings"
          className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeftIcon className="size-5" aria-hidden />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="text-lg font-semibold leading-tight text-foreground lg:text-xl">
            {briefing.meeting_name}
          </h1>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
          {briefing.location ? (
            <p className="text-sm text-muted-foreground">{briefing.location}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 self-center">
          <Button
            variant="outline"
            onClick={() => openReviewsSurface()}
            className="hidden text-sm! lg:inline-flex"
          >
            <MessageSquareIcon className="size-4" aria-hidden />
            Review comments
            {reviewsCount > 0 ? ` (${reviewsCount})` : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}
