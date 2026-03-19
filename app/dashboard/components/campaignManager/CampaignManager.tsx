'use client'

import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import LoadingState from './LoadingState'
import HeaderSection from './HeaderSection'
import { useCampaign } from '@shared/hooks/useCampaign'

export default function AiCampaignManager({ pathname }: { pathname: string }) {
  const [campaign] = useCampaign()
  if (!campaign) {
    return null
  }
  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <HeaderSection />
      <LoadingState />
    </DashboardLayout>
  )
}
