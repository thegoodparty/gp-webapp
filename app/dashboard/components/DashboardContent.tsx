'use client'

import { useEffect, useState } from 'react'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import DashboardPage from './DashboardPage'
import type { Task } from './tasks/TaskItem'
import type { TcrCompliance } from 'helpers/types'
import CampaignManager from './campaignManager/CampaignManager'
import { WebsiteSunsetModal } from '../shared/WebsiteSunsetModal'
import { WEBSITE_SUNSET_NOTICE_ENABLED } from '../shared/websiteSunset'

const AI_CAMPAIGN_MANAGER_FLAG_KEY = 'ai-campaign-manager'
const WEBSITE_SUNSET_MODAL_DISMISSED_KEY = 'websiteSunsetModalDismissed'

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
  const [sunsetModalOpen, setSunsetModalOpen] = useState(false)

  useEffect(() => {
    if (
      hasWebsite &&
      WEBSITE_SUNSET_NOTICE_ENABLED &&
      localStorage.getItem(WEBSITE_SUNSET_MODAL_DISMISSED_KEY) !== '1'
    ) {
      setSunsetModalOpen(true)
    }
  }, [hasWebsite])

  const handleSunsetModalOpenChange = (open: boolean): void => {
    if (!open) {
      localStorage.setItem(WEBSITE_SUNSET_MODAL_DISMISSED_KEY, '1')
    }
    setSunsetModalOpen(open)
  }

  return (
    <>
      {hasWebsite && (
        <WebsiteSunsetModal
          open={sunsetModalOpen}
          onOpenChange={handleSunsetModalOpenChange}
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
