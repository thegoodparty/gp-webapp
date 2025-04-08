'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import { CampaignCountdown } from 'app/(candidate)/dashboard/components/CampaignCountdown'
import { VoterContactsCount } from 'app/(candidate)/dashboard/components/VoterContactsCount'
import { RemainingTasks } from 'app/(candidate)/dashboard/components/RemainingTasks'
import { CampaignProgress } from 'app/(candidate)/dashboard/components/CampaignProgress'

export const DashboardHeader = ({ campaign, tasks = [] }) => {
  const {
    pathToVictory: p2vObject,
    details: campaignDetails,
    completedTaskIds,
  } = campaign || {}
  const pathToVictory = p2vObject?.data || {}
  const { electionDate: electionDateStr } = campaignDetails || {}
  const electionDate = new Date(electionDateStr)

  // TODO: this is wrong! need to calculate completed tasks for current week
  const numOfRemainingTasks = tasks.length - (completedTaskIds?.length || 0)

  return (
    <section className="mb-6">
      <CampaignCountdown electionDate={electionDate} />
      <VoterContactsCount {...{ pathToVictory }} />
      <RemainingTasks numOfRemainingTasks={numOfRemainingTasks} />
      <CampaignProgress {...{ pathToVictory }} />
    </section>
  )
}
