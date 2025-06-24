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

const OUTREACH_OPTIONS = [
  {
    title: 'Text message',
    impact: IMPACTS_LEVELS.medium,
    cost: '$.035/msg',
    type: OUTREACH_TYPES.text,
    requiresPro: true,
  },
  {
    title: 'Robocall',
    impact: IMPACTS_LEVELS.medium,
    cost: '$.045/msg',
    type: OUTREACH_TYPES.robocall,
    requiresPro: true,
  },
  {
    title: 'Door knocking',
    impact: IMPACTS_LEVELS.high,
    cost: 'Free',
    type: OUTREACH_TYPES.doorKnocking,
    requiresPro: true,
  },
  {
    title: 'Phone banking',
    impact: IMPACTS_LEVELS.medium,
    cost: 'Free',
    type: OUTREACH_TYPES.phoneBanking,
    requiresPro: true,
  },
  {
    title: 'Social post',
    impact: IMPACTS_LEVELS.low,
    cost: 'Free',
    type: OUTREACH_TYPES.socialMedia,
  },
]

export default function OutreachCreateCards() {
  const [campaign] = useCampaign()
  const { isPro } = campaign || {}
  const [flowModalTask, setFlowModalTask] = useState(null)
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false)

  const handleCreateClick = (type) => {
    setFlowModalTask({
      flowType: type,
    })
  }

  const openProUpgradeModal = () => {
    setShowProUpgradeModal(true)
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
            onClick:
              requiresPro && !isPro ? openProUpgradeModal : handleCreateClick,
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
