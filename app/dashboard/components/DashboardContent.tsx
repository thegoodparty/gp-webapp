'use client'

import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import DashboardPage from './DashboardPage'
import type { Task } from './tasks/TaskItem'
import type { Campaign, TcrCompliance } from 'helpers/types'
import AiCampaignManager from './aiCampaignManager/AiCampaignManager'

const AI_CAMPAIGN_MANAGER_FLAG_KEY = 'ai-campaign-manager'

interface DashboardContentProps {
  pathname: string
  campaign: Campaign | null
  tasks: Task[]
  tcrCompliance: TcrCompliance | null
}

export default function DashboardContent({
  pathname,
  campaign,
  tasks,
  tcrCompliance,
}: DashboardContentProps): React.JSX.Element {
  const { ready, on: aiCampaignManagerEnabled } = useFlagOn(
    AI_CAMPAIGN_MANAGER_FLAG_KEY,
  )

  if (ready && aiCampaignManagerEnabled) {
    return <AiCampaignManager pathname={pathname} campaign={campaign} />
  }

  return (
    <DashboardPage
      pathname={pathname}
      campaign={campaign}
      tasks={tasks}
      tcrCompliance={tcrCompliance}
    />
  )
}
