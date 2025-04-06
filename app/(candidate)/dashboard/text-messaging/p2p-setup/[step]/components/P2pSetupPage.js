import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import H1 from '@shared/typography/H1'
import EINStep from './EINStep'


const STEPS = {
  EIN: 'ein',
}

export default function P2pSetupPage(props) {
  return (
    <DashboardLayout {...props} showAlert={false}>
      <div>
        <H1>P2P Setup</H1>

        {props.step === STEPS.EIN && <EINStep />}
      </div>
    </DashboardLayout>
  )
}
