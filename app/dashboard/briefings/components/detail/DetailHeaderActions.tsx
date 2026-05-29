'use client'

import { Button, IconButton, ShareIcon } from '@styleguide'
import { useShareScope } from './ShareScope'
import ReadAloudButton from './ReadAloudButton'

type Props = {
  /**
   * Pre-rendered plain-text of the whole briefing. The header Read aloud
   * control reads this top to bottom — header line, executive summary, then
   * every agenda item — so the user gets a hands-free read of the full page.
   */
  speechText: string
}

/**
 * Sticky header actions on the briefing detail page. Renders at every
 * breakpoint:
 *  - mobile (< lg): an icon-only `IconButton` keeps the sub-header
 *    compact next to the meeting title block.
 *  - desktop (lg+): a labelled `Button` with the icon + "Share" text.
 *
 * Both call the same `openShareDrawer` and share the same `aria-label`,
 * so screen readers see one share affordance per page regardless of
 * width.
 *
 * Share opens the bottom drawer whose Copy/Email/Message/Download
 * buttons all point at the public PDF URL served by `gp-api` via the
 * `/api/v1/briefings/:uuid` Vercel rewrite — the client-side react-pdf
 * Download flow this surface used to host was removed alongside that
 * backend cutover.
 *
 * The actual `<ShareBriefingDrawer>` lives in `<ShareScope>` at the
 * layout level — this component just dispatches the open call. That
 * keeps a single Radix Sheet instance on the page so focus / portal
 * management doesn't race with other consumers.
 */
export default function DetailHeaderActions({
  speechText,
}: Props): React.JSX.Element | null {
  const { canShare, openShareDrawer } = useShareScope()

  return (
    <div className="flex items-center gap-2 self-center">
      {/* Read aloud sits to the left of Share. Mirror Share's responsive
          pattern: icon-only below lg, labelled at lg+. */}
      {speechText ? (
        <>
          <span className="lg:hidden">
            <ReadAloudButton
              text={speechText}
              analyticsLabel="briefing"
              compact
            />
          </span>
          <span className="hidden lg:inline-flex">
            <ReadAloudButton text={speechText} analyticsLabel="briefing" />
          </span>
        </>
      ) : null}
      {canShare ? (
        <>
          <IconButton
            type="button"
            size="medium"
            variant="outline"
            aria-label="Share briefing"
            onClick={openShareDrawer}
            className="lg:hidden"
          >
            <ShareIcon className="size-5" aria-hidden />
          </IconButton>
          <Button
            variant="outline"
            onClick={openShareDrawer}
            className="hidden text-sm! lg:inline-flex"
          >
            <ShareIcon className="size-4" aria-hidden />
            Share
          </Button>
        </>
      ) : null}
    </div>
  )
}
