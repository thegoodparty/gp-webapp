import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import H1 from '@shared/typography/H1'
import EINStep from './EINStep'
import WebsiteStep from './WebsiteStep'

const STEPS = {
  EIN: 'ein',
  WEBSITE: 'website',
}

export default function P2pSetupPage(props) {
  return (
    <DashboardLayout {...props} showAlert={false}>
      <div>
        <H1>P2P Setup</H1>

        {props.step === STEPS.EIN && <EINStep />}
        {props.step === STEPS.WEBSITE && <WebsiteStep />}
      </div>
    </DashboardLayout>
  )
}
