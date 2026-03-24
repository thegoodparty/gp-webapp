'use client'

import { useState } from 'react'
import LoadingChecklist, {
  type LoadingItem,
} from '@shared/utils/LoadingChecklist'
import { Card, CardHeader, CardTitle } from '@styleguide'
import { getCookie, setCookie } from 'helpers/cookieHelper'

const AI_CAMPAIGN_COOKIE = 'aiCampaignChecklistComplete'

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

export default function LoadingState({
  hideCallback,
}: {
  hideCallback?: () => void
}) {
  const [showChecklist, setShowChecklist] = useState(
    () => !getCookie(AI_CAMPAIGN_COOKIE),
  )

  const onComplete = () => {
    setCookie(AI_CAMPAIGN_COOKIE, 'true')
    setShowChecklist(false)
    if (hideCallback) {
      hideCallback()
    }
  }

  if (!showChecklist) {
    if (hideCallback) {
      hideCallback()
    }
    return null
  }

  return (
    <Card className="px-4 py-6 mt-4">
      <CardHeader>
        <CardTitle>Preparing your campaign plan...</CardTitle>
      </CardHeader>
      <LoadingChecklist items={loadingItems} onComplete={onComplete} />
    </Card>
  )
}
