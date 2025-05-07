import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { getServerUser } from 'helpers/userServerHelper'
import { ComplianceFormProvider } from './[step]/components/ComplianceFormContext'

export default async function P2pSetupLayout({ children }) {
  const campaign = await fetchUserCampaign()
  const user = await getServerUser()

  const complianceInfo = campaign?.data?.tcrComplianceInfo
  const initialFormData = {
    ein: complianceInfo?.ein || '',
    name: complianceInfo?.name || user.name || '',
    address: complianceInfo?.address || '',
    website: complianceInfo?.website || campaign?.details?.website || '',
    email: complianceInfo?.email || user.email || '',
  }

  return (
    <ComplianceFormProvider initialFormData={initialFormData}>
      {children}
    </ComplianceFormProvider>
  )
}
