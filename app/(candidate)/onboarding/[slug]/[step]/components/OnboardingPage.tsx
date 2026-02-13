import OnboardingLayout from 'app/(candidate)/onboarding/shared/OnboardingLayout'
import PartyStep from './PartyStep'
import OfficeStep from './OfficeStep'
import PledgeStep from './PledgeStep'
import UserSnapScript from '@shared/scripts/UserSnapScript'
import CompleteStep from './CompleteStep'
import { Campaign, PledgeContent } from 'helpers/types'

interface OnboardingPageProps {
  step: number
  campaign: Campaign
  totalSteps: number
  updateCallback?: () => Promise<void>
  adminMode?: boolean
  pledge?: PledgeContent
}

export default function OnboardingPage(
  props: OnboardingPageProps,
): React.JSX.Element {
  const { step, campaign, updateCallback, adminMode } = props
  return (
    <OnboardingLayout>
      <div className="max-w-screen-sm mx-auto px-4 xl:p-0 ">
        {step === 1 && (
          <OfficeStep
            campaign={campaign}
            step={step}
            updateCallback={updateCallback}
            adminMode={adminMode}
          />
        )}
        {step === 2 && <PartyStep campaign={campaign} step={step} />}
        {step === 3 && <PledgeStep campaign={campaign} step={step} />}
        {step === 4 && <CompleteStep />}
      </div>
      <UserSnapScript />
    </OnboardingLayout>
  )
}
