'use client'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import WebsiteCreateFlow from './WebsiteCreateFlow'

export default function WebsiteCreatePage({ pathname, initialIssues }) {
  const [campaign] = useCampaign()

  return (
    <DashboardLayout
      pathname={pathname}
      campaign={campaign}
      showAlert={false}
      hideMenu
    >
      <WebsiteCreateFlow initialIssues={initialIssues} />
    </DashboardLayout>
  )
}
