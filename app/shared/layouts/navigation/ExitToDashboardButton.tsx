'use client'
import { usePathname } from 'next/navigation'
import { Button } from '@styleguide'
import Link from 'next/link'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

export const ExitToDashboardButton = (): React.JSX.Element | null => {
  const pathname = usePathname()
  const isProSignupPath = pathname?.startsWith('/dashboard/pro-sign-up')
  return isProSignupPath ? (
    <Button
      asChild
      variant="outline"
      size="small"
      className="!py-1 !text-sm"
      onClick={() => trackEvent(EVENTS.ProUpgrade.ClickExit, { pathname })}
    >
      <Link href="/dashboard">Exit</Link>
    </Button>
  ) : null
}
