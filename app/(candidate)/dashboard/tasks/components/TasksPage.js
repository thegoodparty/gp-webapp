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
import DeadlineModal from './flows/DeadlineModal'
import {
  ProUpgradeModal,
  VARIANTS,
  VIABILITY_SCORE_THRESHOLD,
} from '../../shared/ProUpgradeModal'
import TaskFlow from './flows/TaskFlow'
import { TASK_TYPES } from '../constants/tasks.const'

export default function TasksPage({
  pathname,
  campaign,
  tasks: tasksProp = [],
}) {
  const [tasks, setTasks] = useState(tasksProp)
  const [completeModalTask, setCompleteModalTask] = useState(null)
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false)
  const [deadlineModalTask, setDeadlineModalTask] = useState(null)
  const [showFlowModal, setShowFlowModal] = useState(null)
  const { errorSnackbar } = useSnackbar()

  const electionDate = campaign.details.electionDate
  const viablityScore = campaign?.pathToVictory?.data?.viability?.score || 0

  const daysUntilElection = daysTill(electionDate)

  // TODO: what if no election date?
  // TODO: what if no p2v?
  async function handleCheckClick(task) {
    const { id: taskId, skipVoterCount } = task

    if (skipVoterCount) {
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
    const { flowType, proRequired, deadline } = task

    if (proRequired && !campaign.isPro) {
      setShowProUpgradeModal(true)
      return
    }

    if (deadline && daysUntilElection < deadline) {
      setDeadlineModalTask(task)
      return
    }

    if (Object.values(TASK_TYPES).includes(flowType)) {
      setShowFlowModal(flowType)
    } else {
      console.error('Unknown flow type:', flowType)
      setShowFlowModal(null)
    }
  }

  async function completeTask(taskId) {
    const resp = await clientFetch(apiRoutes.campaign.tasks.complete, {
      taskId,
    })

    if (resp.ok) {
      const updatedTask = resp.data
      setTasks((currentTasks) => {
        const taskIndex = currentTasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          currentTasks.splice(taskIndex, 1, updatedTask)
          return [...currentTasks]
        } else {
          // Shouldn't happen
          console.error('Completed task not found')
        }
      })
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
              flowType={completeModalTask.flowType}
            />
          )}
          {deadlineModalTask && (
            <DeadlineModal
              deadline={deadlineModalTask?.deadline}
              onClose={() => setDeadlineModalTask(null)}
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
            <TaskFlow
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
