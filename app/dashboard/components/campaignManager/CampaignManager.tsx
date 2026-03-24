'use client'

import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import LoadingState from './LoadingState'
import HeaderSection from './HeaderSection'
import { useCampaign } from '@shared/hooks/useCampaign'
import ProgressSection from './ProgressSection'
import { VoterContactsProvider } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryProvider } from '@shared/hooks/CampaignUpdateHistoryProvider'

export default function CampaignManager({ pathname }: { pathname: string }) {
  const [campaign] = useCampaign()
  if (!campaign) {
    return null
  }
  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <VoterContactsProvider>
        <CampaignUpdateHistoryProvider>
          <HeaderSection />
          <ProgressSection />
          <LoadingState />
        </CampaignUpdateHistoryProvider>
      </VoterContactsProvider>
    </DashboardLayout>
  )
}
