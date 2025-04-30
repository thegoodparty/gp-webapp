import EINStep from './EINStep'
import WebsiteStep from './WebsiteStep'
import EmailStep from './EmailStep'
import ReviewStep from './ReviewStep'
import StyledStepper from 'app/(candidate)/dashboard/text-messaging/p2p-setup/[step]/components/StyledStepper'
import MaxWidth from '@shared/layouts/MaxWidth'
import BackLink from './BackLink'

const P2P_STEPS = [
  { label: 'EIN', route: 'ein', component: <EINStep /> },
  { label: 'Website', route: 'website', component: <WebsiteStep /> },
  { label: 'Email', route: 'email', component: <EmailStep /> },
  { label: 'Review', route: 'review', component: <ReviewStep /> },
]

const P2pSetupPage = ({ step }) => {
  const stepIndex = P2P_STEPS.findIndex((stepDef) => stepDef.route === step)
  return (
    <div className="min-h-[calc(100vh-56px)] bg-indigo-100 p-2 md:p-4">
      <BackLink />
      <MaxWidth>
        <StyledStepper
          activeStep={stepIndex}
          stepLabels={P2P_STEPS.map((s) => s.label)}
        />
        {P2P_STEPS[stepIndex]?.component}
      </MaxWidth>
    </div>
  )
}

export default P2pSetupPage
