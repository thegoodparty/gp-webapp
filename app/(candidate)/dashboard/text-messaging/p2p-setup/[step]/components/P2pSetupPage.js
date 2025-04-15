import EINStep from './EINStep'
import WebsiteStep from './WebsiteStep'
import EmailStep from './EmailStep'
import ReviewStep from './ReviewStep'
import P2PSteps from './P2PSteps'
import MaxWidth from '@shared/layouts/MaxWidth'
import BackLink from './BackLink'
const STEPS = {
  EIN: 'ein',
  WEBSITE: 'website',
  EMAIL: 'email',
  REVIEW: 'review',
}

export default function P2pSetupPage(props) {
  const stepIndex = Object.values(STEPS).indexOf(props.step)
  return (
    <div className="min-h-[calc(100vh-56px)] bg-indigo-100 p-2 md:p-4">
      <BackLink />

      <MaxWidth>
        <P2PSteps activeStep={stepIndex} />
        {props.step === STEPS.EIN && <EINStep />}
        {props.step === STEPS.WEBSITE && <WebsiteStep />}
        {props.step === STEPS.EMAIL && <EmailStep />}
        {props.step === STEPS.REVIEW && <ReviewStep />}
      </MaxWidth>
    </div>
  )
}
