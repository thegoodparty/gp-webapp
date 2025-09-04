'use client'
import { OutreachCreateCard } from './OutreachCreateCard'
import {
  IMPACTS_LEVELS,
  OUTREACH_TYPES,
} from 'app/(candidate)/dashboard/outreach/constants'
import TaskFlow from 'app/(candidate)/dashboard/components/tasks/flows/TaskFlow'
import { useState } from 'react'
import { useCampaign } from '@shared/hooks/useCampaign'
import {
  ProUpgradeModal,
  VARIANTS,
} from 'app/(candidate)/dashboard/shared/ProUpgradeModal'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export const OUTREACH_OPTIONS = [
  {
    title: 'Text message',
    impact: IMPACTS_LEVELS.medium,
    cost: 0.035,
    type: OUTREACH_TYPES.text,
    requiresPro: true,
  },
  {
    title: 'Robocall',
    impact: IMPACTS_LEVELS.medium,
    cost: 0.045,
    type: OUTREACH_TYPES.robocall,
    requiresPro: true,
  },
  {
    title: 'Door knocking',
    impact: IMPACTS_LEVELS.high,
    cost: 0,
    type: OUTREACH_TYPES.doorKnocking,
    requiresPro: true,
  },
  {
    title: 'Phone banking',
    impact: IMPACTS_LEVELS.medium,
    cost: 0,
    type: OUTREACH_TYPES.phoneBanking,
    requiresPro: true,
  },
  {
    title: 'Social post',
    impact: IMPACTS_LEVELS.low,
    cost: 0,
    type: OUTREACH_TYPES.socialMedia,
  },
]

export default function OutreachCreateCards() {
  const [campaign] = useCampaign()
  const { isPro } = campaign || {}
  const [flowModalTask, setFlowModalTask] = useState(null)
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false)

  const openProUpgradeModal = () => {
    setShowProUpgradeModal(true)
  }

  const openTaskFlow = (type) =>
    setFlowModalTask({
      flowType: type,
    })

  const handleCreateClick = (requiresPro) => (type) => {
    trackEvent(EVENTS.Outreach.ClickCreate, { type })

    if (requiresPro && !isPro) {
      trackEvent(EVENTS.Outreach.P2PCompliance.ComplianceStarted, {
        source: 'outreach_page',
      })
      return openProUpgradeModal()
    }

    return openTaskFlow(type)
  }

  return (
    <div
      className="
        w-full
        grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-3
        xl:grid-cols-5
        gap-4
        md:gap-6
        justify-center
        lg:bg-gray-200
        rounded-2xl
        p-0
        lg:p-6
        mb-12
      "
    >
      {OUTREACH_OPTIONS.map(({ title, impact, cost, type, requiresPro }) => (
        <OutreachCreateCard
          key={type}
          {...{
            type,
            title,
            impact,
            cost,
            onClick: handleCreateClick(requiresPro),
            requiresPro,
          }}
        />
      ))}
      <ProUpgradeModal
        {...{
          variant: VARIANTS.Second_NonViable,
          open: showProUpgradeModal,
          onClose: () => setShowProUpgradeModal(false),
        }}
      />

      {flowModalTask && campaign && (
        <TaskFlow
          forceOpen
          type={flowModalTask.flowType}
          campaign={campaign}
          onClose={() => setFlowModalTask(null)}
        />
      )}
    </div>
  )
}
