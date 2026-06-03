'use client'

import { useState } from 'react'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import DashboardPage from './DashboardPage'
import type { Task } from './tasks/TaskItem'
import type { TcrCompliance } from 'helpers/types'
import CampaignManager from './campaignManager/CampaignManager'
import { WebsiteSunsetModal } from '../shared/WebsiteSunsetModal'

const AI_CAMPAIGN_MANAGER_FLAG_KEY = 'ai-campaign-manager'

interface DashboardContentProps {
  pathname: string
  tasks: Task[]
  tcrCompliance: TcrCompliance | null
  hasWebsite: boolean
}

export default function DashboardContent({
  pathname,
  tasks,
  tcrCompliance,
  hasWebsite,
}: DashboardContentProps): React.JSX.Element {
  const { ready, on: aiCampaignManagerEnabled } = useFlagOn(
    AI_CAMPAIGN_MANAGER_FLAG_KEY,
  )
  const [sunsetModalOpen, setSunsetModalOpen] = useState(true)

  return (
    <>
      {hasWebsite && (
        <WebsiteSunsetModal
          open={sunsetModalOpen}
          onOpenChange={setSunsetModalOpen}
        />
      )}
      {ready && aiCampaignManagerEnabled ? (
        <CampaignManager pathname={pathname} tcrCompliance={tcrCompliance} />
      ) : (
        <DashboardPage
          pathname={pathname}
          tasks={tasks}
          tcrCompliance={tcrCompliance}
        />
      )}
    </>
  )
}
