'use client'

import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import type { Campaign } from 'helpers/types'
import LoadingState from './LoadingState'

export default function CampaignManager({
  pathname,
  campaign,
}: {
  pathname: string
  campaign: Campaign | null
}) {
  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <LoadingState />
    </DashboardLayout>
  )
}
