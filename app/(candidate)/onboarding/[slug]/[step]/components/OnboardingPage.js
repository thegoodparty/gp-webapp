import OnboardingLayout from 'app/(candidate)/onboarding/shared/OnboardingLayout'
import PartyStep from './PartyStep'
import OfficeStep from './OfficeStep'
import PledgeStep from './PledgeStep'
import UserSnapScript from '@shared/scripts/UserSnapScript'
import CompleteStep from './CompleteStep'

export default function OnboardingPage(props) {
  const { step } = props
  return (
    <OnboardingLayout {...props}>
      <div className="max-w-screen-sm mx-auto px-4 xl:p-0 ">
        {step === 1 && <OfficeStep {...props} />}
        {step === 2 && <PartyStep {...props} />}
        {step === 3 && <PledgeStep {...props} />}
        {step === 4 && <CompleteStep {...props} />}
      </div>
      <UserSnapScript />
    </OnboardingLayout>
  )
}
