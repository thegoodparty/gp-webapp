'use client'
import { useState } from 'react'
import TaskItem, { Task } from './TaskItem'
import H2 from '@shared/typography/H2'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'
import { dateUsHelper } from 'helpers/dateHelper'
import { DashboardHeader } from 'app/(candidate)/dashboard/components/DashboardHeader'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useSnackbar } from 'helpers/useSnackbar'
import LogTaskModal, {
  TASK_TYPE_HEADINGS,
  LogTaskFlowType,
} from './LogTaskModal'
import DeadlineModal from './flows/DeadlineModal'
import {
  ProUpgradeModal,
  VARIANTS,
  VIABILITY_SCORE_THRESHOLD,
} from '../../shared/ProUpgradeModal'
import {
  P2PUpgradeModal,
  P2P_MODAL_VARIANTS,
} from '../../shared/P2PUpgradeModal'
import { ComplianceModal } from '../../shared/ComplianceModal'
import { TCR_COMPLIANCE_STATUS } from 'app/(user)/profile/texting-compliance/components/ComplianceSteps'
import TaskFlow from './flows/TaskFlow'
import { TASK_TYPES } from '../../shared/constants/tasks.const'
import { differenceInDays } from 'date-fns'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useP2pUxEnabled } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'
import { Campaign, TcrCompliance } from 'helpers/types'
import { isValidOutreachType } from 'app/(candidate)/dashboard/outreach/util/getEffectiveOutreachType'

interface TasksListProps {
  campaign: Campaign
  tasks?: Task[]
  tcrCompliance?: TcrCompliance | null
}

const TasksList = ({
  campaign,
  tasks: tasksProp = [],
  tcrCompliance,
}: TasksListProps): React.JSX.Element => {
  const { p2pUxEnabled } = useP2pUxEnabled()
  const [tasks, setTasks] = useState<Task[]>(tasksProp)
  const [completeModalTask, setCompleteModalTask] = useState<Task | null>(null)
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false)
  const [showP2PModal, setShowP2PModal] = useState(false)
  const [showComplianceModal, setShowComplianceModal] = useState(false)
  const [p2pTrackingAttrs, setP2PTrackingAttrs] =
    useState<ReturnType<typeof buildTrackingAttrs>>({})
  const [deadlineModalTask, setDeadlineModalTask] = useState<Task | null>(null)
  const [flowModalTask, setFlowModalTask] = useState<Task | null>(null)
  const [proUpgradeTrackingAttrs, setProUpgradeTrackingAttrs] =
    useState<ReturnType<typeof buildTrackingAttrs>>({})
  const { errorSnackbar } = useSnackbar()

  const { details, pathToVictory, hasFreeTextsOffer } = campaign
  const isPro = campaign.isPro ?? false
  const { electionDate } = details
  const viabilityScore = pathToVictory?.data?.viability?.score || 0
  const daysUntilElection = differenceInDays(electionDate!, new Date())

  const handleCheckClick = async (task: Task) => {
    const { id: taskId, flowType: type } = task

    // skip voter counts for education tasks
    if (type === TASK_TYPES.education) {
      completeTask(taskId)
    } else {
      setCompleteModalTask(task)
    }
  }

  const handleCompleteSubmit = (_count: number) => {
    completeTask(completeModalTask!.id)
    setCompleteModalTask(null)
  }

  const handleCompleteCancel = () => {
    setCompleteModalTask(null)
  }

  const handleActionClick = (task: Task) => {
    const { flowType, proRequired, deadline } = task
    const isTextCompliant =
      tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED

    if (flowType === TASK_TYPES.text) {
      if (!isPro) {
        setShowP2PModal(true)
        setP2PTrackingAttrs(
          buildTrackingAttrs('Upgrade to Pro', {
            viabilityScore,
            type: flowType,
          }),
        )
        return
      }
      if (p2pUxEnabled && !isTextCompliant) {
        setShowComplianceModal(true)
        return
      }
    } else if (proRequired && !isPro) {
      trackEvent(EVENTS.Outreach.P2PCompliance.ComplianceStarted, {
        source: 'task_list',
      })
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

    if (isValidOutreachType(flowType)) {
      setFlowModalTask(task)
    } else {
      console.error('Unknown or unsupported outreach type:', flowType)
      setFlowModalTask(null)
    }
  }

  const completeTask = async (taskId: string) => {
    const resp = await clientFetch<Task>(apiRoutes.campaign.tasks.complete, {
      taskId,
    })

    if (resp.ok) {
      const updatedTask = resp.data
      setTasks((currentTasks) => {
        const taskIndex = currentTasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          currentTasks.splice(taskIndex, 1, updatedTask)
          return [...currentTasks]
        }
        // Shouldn't happen
        console.error('Completed task not found')
        return currentTasks
      })
    } else {
      errorSnackbar('Failed to complete task')
    }
  }

  return (
    <>
      <DashboardHeader campaign={campaign} tasks={tasks} />
      <div className="mx-auto bg-white rounded-xl p-6 mt-8 mb-32">
        <H2>Tasks for this week</H2>
        <Body2 className="!font-outfit mt-1">
          Election day: {dateUsHelper(electionDate!)}
        </Body2>

        <ul className="p-0 mt-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isPro={isPro}
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
      {completeModalTask &&
        ((value: Task['flowType']): value is LogTaskFlowType =>
          value in TASK_TYPE_HEADINGS)(completeModalTask.flowType) && (
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
      <P2PUpgradeModal
        open={showP2PModal}
        variant={(() => {
          if (!isPro) return P2P_MODAL_VARIANTS.NonProUpgrade
          const isTextCompliant = tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED
          if (p2pUxEnabled && hasFreeTextsOffer && !isTextCompliant) {
            return P2P_MODAL_VARIANTS.ProFreeTextsNonCompliant
          }
          return P2P_MODAL_VARIANTS.NonProUpgrade
        })()}
        onClose={() => setShowP2PModal(false)}
        onUpgradeLinkClick={undefined}
        trackingAttrs={p2pTrackingAttrs}
      />
      {p2pUxEnabled && (
        <ComplianceModal
          open={showComplianceModal}
          tcrComplianceStatus={tcrCompliance?.status}
          onClose={() => setShowComplianceModal(false)}
        />
      )}
      {flowModalTask && isValidOutreachType(flowModalTask.flowType) && (
        <TaskFlow
          forceOpen
          type={flowModalTask.flowType}
          campaign={campaign}
          onClose={() => setFlowModalTask(null)}
          defaultAiTemplateId={flowModalTask.defaultAiTemplateId}
        />
      )}
    </>
  )
}

export default TasksList
