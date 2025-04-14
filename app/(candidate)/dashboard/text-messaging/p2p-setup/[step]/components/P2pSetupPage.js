import EINStep from './EINStep'
import WebsiteStep from './WebsiteStep'
import EmailStep from './EmailStep'
import ReviewStep from './ReviewStep'
import P2PSteps from './P2PSteps'
const STEPS = {
  EIN: 'ein',
  WEBSITE: 'website',
  EMAIL: 'email',
  REVIEW: 'review',
}

export default function P2pSetupPage(props) {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-indigo-100 p-2 md:p-4">
      <P2PSteps step={props.step} />
      {props.step === STEPS.EIN && <EINStep />}
      {props.step === STEPS.WEBSITE && <WebsiteStep />}
      {props.step === STEPS.EMAIL && <EmailStep />}
      {props.step === STEPS.REVIEW && <ReviewStep />}
    </div>
  )
}
