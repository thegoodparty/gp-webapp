'use client'

import { useState } from 'react'
import LoadingChecklist, {
  type LoadingItem,
} from '@shared/utils/LoadingChecklist'
import { Card, CardHeader, CardTitle } from '@styleguide'
import { getCookie, setCookie } from 'helpers/cookieHelper'

const AI_CAMPAIGN_COOKIE_PREFIX = 'aiCampaignChecklistComplete'

const loadingItems: LoadingItem[] = [
  {
    label: 'Analyzing district data',
    status: 'loading',
  },
  {
    label: 'Calculating electoral goals',
    status: 'pending',
  },
  {
    label: 'Developing a strategic landscape',
    status: 'pending',
  },
  {
    label: 'Searching for local events',
    status: 'pending',
  },
  {
    label: 'Crafting voter outreach strategy',
    status: 'pending',
  },
  {
    label: 'Building your campaign timeline',
    status: 'pending',
  },
]

export default function LoadingState({ campaignId }: { campaignId: number }) {
  const cookieName = `${AI_CAMPAIGN_COOKIE_PREFIX}_${campaignId}`
  const [showChecklist, setShowChecklist] = useState(
    () => !getCookie(cookieName),
  )

  const onComplete = () => {
    setCookie(cookieName, 'true')
    setShowChecklist(false)
  }

  if (!showChecklist) {
    return null
  }

  return (
    <Card className="px-4 py-6">
      <CardHeader>
        <CardTitle>Preparing your campaign plan...</CardTitle>
      </CardHeader>
      <LoadingChecklist items={loadingItems} onComplete={onComplete} />
    </Card>
  )
}
