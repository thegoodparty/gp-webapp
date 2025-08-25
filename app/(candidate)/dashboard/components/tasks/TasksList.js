'use client'
import { useCallback, useState } from 'react'
import TaskItem from './TaskItem'
import H2 from '@shared/typography/H2'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'
import { dateUsHelper } from 'helpers/dateHelper'
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
import { TASK_TYPES } from '../../shared/constants/tasks.const'
import { differenceInDays } from 'date-fns'
import { buildTrackingAttrs } from 'helpers/analyticsHelper'
import { useTasks } from './TasksProvider'

export default function TasksList({ campaign }) {
  const [tasks, setTasks, refreshTasks] = useTasks()
  const [completeModalTask, setCompleteModalTask] = useState(null)
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false)
  const [deadlineModalTask, setDeadlineModalTask] = useState(null)
  const [flowModalTask, setFlowModalTask] = useState(null)
  const [proUpgradeTrackingAttrs, setProUpgradeTrackingAttrs] = useState({})
  const { errorSnackbar } = useSnackbar()

  const electionDate = campaign.details.electionDate
  const viabilityScore = campaign?.pathToVictory?.data?.viability?.score || 0
  const daysUntilElection = differenceInDays(electionDate, new Date())

  async function completeTask(id) {
    await clientFetch(apiRoutes.campaign.tasks.complete, {
      id,
    })
  }

  async function deleteCompleteTask(id) {
    await clientFetch(apiRoutes.campaign.tasks.uncomplete, {
      id,
    })
  }

  async function handleCheckClick(task) {
    const { id, flowType: type } = task

    // skip voter counts for education tasks
    if (type === TASK_TYPES.education) {
      await completeTask(id)
    } else {
      setCompleteModalTask(task)
    }
    refreshTasks()
  }

  async function handleUnCheckClick(task) {
    const { id } = task
    await deleteCompleteTask(id)
    refreshTasks()
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
      setProUpgradeTrackingAttrs(
        buildTrackingAttrs('Upgrade to Pro', {
          viabilityScore,
          type: flowType,
        }),
      )
      return
    }

    if (deadline && daysUntilElection < deadline) {
      setDeadlineModalTask(task)
      return
    }

    if (Object.values(TASK_TYPES).includes(flowType)) {
      setFlowModalTask(task)
    } else {
      console.error('Unknown flow type:', flowType)
      setFlowModalTask(null)
    }
  }

  const handleFlowComplete = useCallback(
    async (id) => {
      if (id) {
        await completeTask(id)
      }
      refreshTasks()
    },
    [refreshTasks],
  )

  return (
    <>
      <DashboardHeader campaign={campaign} tasks={tasks} />
      <div className="mx-auto bg-white rounded-xl p-6 mt-8 mb-32">
        <H2>Tasks</H2>
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
                onUnCheck={handleUnCheckClick}
              />
            ))
          ) : (
            <li className="block text-center p-4 mt-4 bg-white rounded-lg border border-black/[0.12]">
              <H4 className="mt-1">No tasks available</H4>
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
          type={deadlineModalTask.flowType}
          deadline={deadlineModalTask.deadline}
          onClose={() => setDeadlineModalTask(null)}
        />
      )}
      <ProUpgradeModal
        open={showProUpgradeModal}
        variant={
          viabilityScore < VIABILITY_SCORE_THRESHOLD
            ? VARIANTS.Second_NonViable
            : VARIANTS.Second_Viable
        }
        onClose={() => setShowProUpgradeModal(false)}
        trackingAttrs={proUpgradeTrackingAttrs}
      />
      {flowModalTask && (
        <TaskFlow
          forceOpen
          type={flowModalTask.flowType}
          campaign={campaign}
          onClose={() => setFlowModalTask(null)}
          defaultAiTemplateId={flowModalTask.defaultAiTemplateId}
          onComplete={handleFlowComplete}
          id={flowModalTask?.id}
        />
      )}
    </>
  )
}
