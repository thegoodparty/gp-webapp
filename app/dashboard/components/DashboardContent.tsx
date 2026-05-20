'use client'

import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import DashboardPage from './DashboardPage'
import type { Task } from './tasks/TaskItem'
import type { TcrCompliance } from 'helpers/types'
import CampaignManager from './campaignManager/CampaignManager'

const AI_CAMPAIGN_MANAGER_FLAG_KEY = 'ai-campaign-manager'

interface DashboardContentProps {
  pathname: string
  tasks: Task[]
  tcrCompliance: TcrCompliance | null
}

export default function DashboardContent({
  pathname,
  tasks,
  tcrCompliance,
}: DashboardContentProps): React.JSX.Element {
  const { ready, on: aiCampaignManagerEnabled } = useFlagOn(
    AI_CAMPAIGN_MANAGER_FLAG_KEY,
  )

  if (ready && aiCampaignManagerEnabled) {
    return <CampaignManager pathname={pathname} tcrCompliance={tcrCompliance} />
  }

  return (
    <DashboardPage
      pathname={pathname}
      tasks={tasks}
      tcrCompliance={tcrCompliance}
    />
  )
}
