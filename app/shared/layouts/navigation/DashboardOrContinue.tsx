'use client'
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus'
import Button from '@shared/buttons/Button'

interface DashboardOrContinueProps {
  closeAll: () => void
  isDashboardPath?: boolean
}

const DashboardOrContinue = ({ closeAll }: DashboardOrContinueProps): React.JSX.Element => {
  const [campaignStatus] = useCampaignStatus()
  const { status, slug, step } = (campaignStatus as { status?: boolean | string; slug?: string; step?: string | number }) || {}

  if (!status) {
    return (
      <Button
        href={`/onboarding/${slug || ''}/${step || '1'}`}
        onClick={closeAll}
        id="nav-continue-setup"
        color="secondary"
        className="!py-2 !text-base font-medium border-none ml-2"
      >
        Continue Setup
      </Button>
    )
  }

  return (
    <div className="ml-4">
      {['candidate'].includes(String(status)) ? (
        <Button
          href="/dashboard"
          onClick={closeAll}
          id={'nav-dashboard'}
          className="font-medium !text-base !py-2 border-none"
        >
          Dashboard
        </Button>
      ) : (
        <Button
          href={`/onboarding/${slug}/${step || 1}`}
          onClick={closeAll}
          id="nav-continue-onboarding"
          color="secondary"
          className="!py-2 !text-base font-medium border-none"
        >
          Continue<span className="hidden lg:inline"> Onboarding</span>
        </Button>
      )}
    </div>
  )
}

export default DashboardOrContinue

