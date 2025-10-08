'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'

export default function WebsitePage({ pathname }) {
  const [campaign] = useCampaign()

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      polls page
    </DashboardLayout>
  )
}
