'use client'

import { Button, IconButton, MessageSquareIcon } from '@styleguide'
import { useReviewAnnotationsCtx } from '@shared/annotations/review/ReviewAnnotationsScope'

/**
 * Review-mode bottom bars. A single action — open the review-comments
 * cycler — at both breakpoints, replacing the candidate-facing
 * Notes / Assistant bars. Highlighting briefing text and using the
 * floating toolbar remains the primary way to add a comment; this bar is
 * the always-available way to browse existing comments.
 */
export default function ReviewBottomBars(): React.JSX.Element {
  const { openReviewsSurface, reviewsCount } = useReviewAnnotationsCtx()
  const label =
    reviewsCount > 0 ? `Review comments (${reviewsCount})` : 'Review comments'

  return (
    <>
      <div className="fixed bottom-0 right-0 left-0 z-[5] hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:left-[var(--sidebar-width,16rem)] lg:block">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-end gap-2 px-8 py-3">
          <Button
            variant="outline"
            onClick={() => openReviewsSurface()}
            className="text-sm!"
          >
            <MessageSquareIcon className="size-4" aria-hidden />
            {label}
          </Button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 lg:hidden">
        <div className="mx-auto flex w-full max-w-[800px] items-center justify-end gap-2 px-4 py-3">
          <IconButton
            type="button"
            size="medium"
            variant="outline"
            aria-label={label}
            onClick={() => openReviewsSurface()}
          >
            <MessageSquareIcon className="size-5" aria-hidden />
          </IconButton>
        </div>
      </div>
    </>
  )
}
