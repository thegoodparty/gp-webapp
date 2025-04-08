'use client'
import { useState } from 'react'
import { InfoOutlined } from '@mui/icons-material'
import Tooltip from '@mui/material/Tooltip'
import DashboardLayout from '../../shared/DashboardLayout'
import TaskItem from './TaskItem'
import H2 from '@shared/typography/H2'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'
import { dateUsHelper, daysTill, weeksTill } from 'helpers/dateHelper'
import { VoterContactsProvider } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryProvider } from '@shared/hooks/CampaignUpdateHistoryProvider'
import { DashboardHeader } from 'app/(candidate)/dashboard/components/DashboardHeader'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useSnackbar } from 'helpers/useSnackbar'
import LogTaskModal from './LogTaskModal'
import {
  ProUpgradeModal,
  VARIANTS,
  VIABILITY_SCORE_THRESHOLD,
} from '../../shared/ProUpgradeModal'
import ScheduleFlow from './flows/ScheduleFlow'
import {
  TASK_TYPE_HEADINGS,
  TASK_TYPE_LABELS,
  TASK_TYPES,
} from '../constants/tasks.const'

export default function TasksPage({ pathname, campaign, tasks = [] }) {
  const [completedTaskIds, setCompletedTaskIds] = useState(
    campaign.completedTaskIds,
  )
  const [completeModalTask, setCompleteModalTask] = useState(null)
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false)
  const [showFlowModal, setShowFlowModal] = useState(null)
  const { errorSnackbar } = useSnackbar()

  const electionDate = campaign.details.electionDate
  const viablityScore = campaign?.pathToVictory?.data?.viability?.score || 0

  const daysUntilElection = daysTill(electionDate)

  // TODO: what if no election date?
  // TODO: what if no p2v?
  async function handleCheckClick(task) {
    // TODO: connect skipCount to whatever actual field will be
    const { id: taskId, skipCount } = task

    if (skipCount) {
      completeTask(taskId)
    } else {
      setCompleteModalTask(task)
    }
  }

  function handleCompleteSubmit(_count) {
    completeTask(completeModalTask.id)
    setCompleteModalTask(null)
  }

  function handleCompleteCancel() {
    setCompleteModalTask(null)
  }

  const handleActionClick = (task) => {
    const { flowType, proRequired } = task

    if (proRequired && !campaign.isPro) {
      setShowProUpgradeModal(true)
      return
    }

    switch (flowType) {
      case TASK_TYPES.texting:
        setShowFlowModal(TASK_TYPES.texting)
        break
      case TASK_TYPES.robocall:
        // TODO: implement robocall flow
        console.log('robocall flow')
        break
      case TASK_TYPES.doorKnocking:
        // TODO: implement door knocking flow
        console.log('door knocking flow')
        break
      case TASK_TYPES.phoneBanking:
        // TODO: implement phone banking flow
        console.log('phone banking flow')
        break
      default:
        console.warn('Unknown task type:', flowType)
        setShowFlowModal(null)
    }
  }

  async function completeTask(taskId) {
    const resp = await clientFetch(apiRoutes.campaign.tasks.complete, {
      taskId,
    })

    if (resp.ok) {
      setCompletedTaskIds((currentIds) => [...currentIds, taskId])
    } else {
      errorSnackbar('Failed to complete task')
    }
  }

  const { weeks, days } = weeksTill(electionDate)

  return (
    <VoterContactsProvider>
      <CampaignUpdateHistoryProvider>
        <DashboardLayout pathname={pathname} campaign={campaign}>
          <DashboardHeader campaign={campaign} tasks={tasks} />
          <div className="mx-auto bg-white rounded-xl p-6 mt-8">
            <H2>
              Tasks for this week
              <Tooltip
                placement="right"
                title={`${weeks} week${weeks === 1 ? '' : 's'} and ${days} day${
                  days === 1 ? '' : 's'
                } until election.`}
              >
                <InfoOutlined className="!text-base ml-1" />
              </Tooltip>
            </H2>
            <Body2 className="!font-outfit mt-1">
              Election day: {dateUsHelper(electionDate)}
            </Body2>

            <ul className="p-0 mt-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isPro={campaign.isPro}
                    daysUntilElection={daysUntilElection}
                    isCompleted={completedTaskIds?.includes(task.id)}
                    onCheck={handleCheckClick}
                    onAction={handleActionClick}
                  />
                ))
              ) : (
                <li className="block text-center p-4 mt-4 bg-white rounded-lg border border-black/[0.12]">
                  <H4 className="mt-1">No tasks for this week</H4>
                </li>
              )}
            </ul>
          </div>
          {completeModalTask && (
            <LogTaskModal
              onSubmit={handleCompleteSubmit}
              onClose={handleCompleteCancel}
              modalTitle={TASK_TYPE_HEADINGS[completeModalTask.flowType]}
              modalLabel={TASK_TYPE_LABELS[completeModalTask.flowType]}
              flowType={completeModalTask.flowType}
            />
          )}
          <ProUpgradeModal
            open={showProUpgradeModal}
            variant={
              viablityScore < VIABILITY_SCORE_THRESHOLD
                ? VARIANTS.Second_NonViable
                : VARIANTS.Second_Viable
            }
            onClose={() => setShowProUpgradeModal(false)}
          />
          {showFlowModal && (
            <ScheduleFlow
              forceOpen
              type={showFlowModal}
              campaign={campaign}
              onClose={() => setShowFlowModal(null)}
            />
          )}
        </DashboardLayout>
      </CampaignUpdateHistoryProvider>
    </VoterContactsProvider>
  )
}
