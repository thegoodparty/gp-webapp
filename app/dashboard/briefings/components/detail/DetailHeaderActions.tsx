'use client'

import { Button, Share2Icon } from '@styleguide'
import { useShareScope } from './ShareScope'

/**
 * Sticky header actions on desktop. Share opens the bottom drawer whose
 * Copy/Email/Message/Download buttons all point at the public PDF URL
 * served by `gp-api` via the `/api/v1/briefings/:uuid` Vercel rewrite —
 * the client-side react-pdf Download flow this surface used to host was
 * removed alongside that backend cutover.
 *
 * "Add note" + "Briefing assistant" used to live here, but the desktop
 * action surface is now the sticky `DesktopBottomBar` at the bottom of
 * the page — matching the mobile layout and the Lovable design.
 *
 * The actual `<ShareBriefingDrawer>` lives in `<ShareScope>` at the
 * layout level — this component just dispatches the open call. That
 * keeps a single Radix Sheet instance on the page so focus / portal
 * management doesn't race with the mirror in `MobileBottomBar`.
 */
export default function DetailHeaderActions(): React.JSX.Element | null {
  const { canShare, openShareDrawer } = useShareScope()

  if (!canShare) return null

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button variant="outline" onClick={openShareDrawer}>
        <Share2Icon className="size-4" aria-hidden />
        Share
      </Button>
    </div>
  )
}
