'use client'

import { useState } from 'react'
import LoadingChecklist, {
  type LoadingItem,
} from '@shared/utils/LoadingChecklist'
import { Card, CardHeader, CardTitle } from '@styleguide'
import { getCookie, setCookie } from 'helpers/cookieHelper'

export const AI_CAMPAIGN_CHECKLIST_COOKIE = 'aiCampaignChecklistComplete'

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
    () => !getCookie(AI_CAMPAIGN_CHECKLIST_COOKIE),
  )

  const onComplete = () => {
    setCookie(AI_CAMPAIGN_CHECKLIST_COOKIE, 'true')
    setShowChecklist(false)
    if (hideCallback) {
      hideCallback()
    }
  }

  if (!showChecklist) {
    return null
  }

  return (
    <Card className="gap-0 p-0 font-opensans">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-lg font-semibold">
          Preparing your campaign plan...
        </CardTitle>
      </CardHeader>
      <div className="p-6 pt-0">
        <LoadingChecklist items={loadingItems} onComplete={onComplete} />
      </div>
    </Card>
  )
}
