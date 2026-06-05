'use client'
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus'
import { Button } from '@styleguide'
import Link from 'next/link'

interface DashboardOrContinueProps {
  closeAll: () => void
  isDashboardPath?: boolean
}

const DashboardOrContinue = ({
  closeAll,
}: DashboardOrContinueProps): React.JSX.Element => {
  const [campaignStatus] = useCampaignStatus()
  const { status, slug, step } =
    (campaignStatus as {
      status?: boolean | string
      slug?: string
      step?: string | number
    }) || {}

  if (!status) {
    const href = slug
      ? `/onboarding/${slug}/${step || '1'}`
      : '/onboarding/office-selection'
    return (
      <Button
        asChild
        variant="secondary"
        id="nav-continue-setup"
        onClick={closeAll}
        className="!py-2 !text-base font-medium border-none ml-2"
      >
        <Link href={href}>Continue Setup</Link>
      </Button>
    )
  }

  return (
    <div className="ml-4">
      {['candidate'].includes(String(status)) ? (
        <Button
          asChild
          id="nav-dashboard"
          onClick={closeAll}
          className="font-medium !text-base !py-2 border-none"
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <Button
          asChild
          variant="secondary"
          id="nav-continue-onboarding"
          onClick={closeAll}
          className="!py-2 !text-base font-medium border-none"
        >
          <Link
            href={
              slug
                ? `/onboarding/${slug}/${step || 1}`
                : '/onboarding/office-selection'
            }
          >
            Continue<span className="hidden lg:inline"> Onboarding</span>
          </Link>
        </Button>
      )}
    </div>
  )
}

export default DashboardOrContinue
