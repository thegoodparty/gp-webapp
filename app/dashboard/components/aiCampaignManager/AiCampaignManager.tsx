import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import { Campaign } from 'helpers/types'

export default function AiCampaignManager({
  pathname,
  campaign,
}: {
  pathname: string
  campaign: Campaign | null
}) {
  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <div>AiCampaignManager</div>
    </DashboardLayout>
  )
}
