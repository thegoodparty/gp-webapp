'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import TaskItem, { Task } from './TaskItem'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'
import { dateUsHelper } from 'helpers/dateHelper'
import { DashboardHeader } from 'app/dashboard/components/DashboardHeader'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes, type ApiRoute } from 'gpApi/routes'
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
import { TCR_COMPLIANCE_STATUS } from 'app/dashboard/profile/texting-compliance/components/ComplianceSteps'
import TaskFlow from './flows/TaskFlow'
import { TASK_TYPES } from '../../shared/constants/tasks.const'
import { differenceInDays } from 'date-fns'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import WeeklyTaskNavigator from './WeeklyTaskNavigator'
import { useWeekNavigation } from './useWeekNavigation'
import { useP2pUxEnabled } from 'app/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'
import { Campaign, TcrCompliance } from 'helpers/types'
import { isValidOutreachType } from 'app/dashboard/outreach/util/getEffectiveOutreachType'
import type { OutreachType } from 'gpApi/outreach.api'
import { useQueryClient } from '@tanstack/react-query'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { useCampaignUpdateHistory } from '@shared/hooks/useCampaignUpdateHistory'
import type { CampaignUpdateHistoryWithUser } from '@shared/hooks/CampaignUpdateHistoryProvider'
import { Card, cn } from '@styleguide'

const NON_OUTREACH_TYPES = [
  TASK_TYPES.education,
  TASK_TYPES.events,
  TASK_TYPES.compliance,
]

interface TasksListProps {
  campaign: Campaign
  tasks?: Task[]
  tcrCompliance?: TcrCompliance | null
  isLegacyList?: boolean
}

const TasksList = ({
  campaign,
  tasks: tasksProp = [],
  tcrCompliance,
  isLegacyList = true,
}: TasksListProps): React.JSX.Element => {
  const router = useRouter()
  const { p2pUxEnabled } = useP2pUxEnabled()
  const [tasks, setTasks] = useState<Task[]>(tasksProp)

  useEffect(() => {
    setTasks(tasksProp)
  }, [tasksProp])

  const { details, pathToVictory, hasFreeTextsOffer } = campaign
  const isPro = campaign.isPro ?? false
  const { electionDate } = details ?? {}
  const viabilityScore = pathToVictory?.data?.viability?.score || 0
  const electionDateObj =
    typeof electionDate === 'string' && electionDate
      ? new Date(electionDate.replace(/-/g, '/'))
      : null
  const daysUntilElection = electionDateObj
    ? differenceInDays(electionDateObj, new Date())
    : Infinity

  const {
    currentWeekStart,
    filteredTasks,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
  } = useWeekNavigation(
    tasks,
    String(campaign.id),
    electionDateObj,
    daysUntilElection,
  )

  const [completeModalTask, setCompleteModalTask] = useState<Task | null>(null)
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false)
  const [showP2PModal, setShowP2PModal] = useState(false)
  const [showComplianceModal, setShowComplianceModal] = useState(false)
  const [p2pTrackingAttrs, setP2PTrackingAttrs] = useState<
    ReturnType<typeof buildTrackingAttrs>
  >({})
  const [deadlineModalTask, setDeadlineModalTask] = useState<Task | null>(null)
  const [flowModalTask, setFlowModalTask] = useState<{
    task: Task
    resolvedType: OutreachType
  } | null>(null)
  const [proUpgradeTrackingAttrs, setProUpgradeTrackingAttrs] = useState<
    ReturnType<typeof buildTrackingAttrs>
  >({})
  const { errorSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [, setUpdateHistory] = useCampaignUpdateHistory()
  const inFlightTasks = useRef(new Set<string>())

  const refreshAfterTaskMutation = async () => {
    await queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEY })
    const resp = await clientFetch<CampaignUpdateHistoryWithUser[]>(
      apiRoutes.campaign.updateHistory.list,
    )
    if ('ok' in resp && resp.ok) {
      setUpdateHistory(resp.data || [])
    }
  }

  const handleCheckClick = async (task: Task) => {
    const { id: taskId, flowType: type, completed } = task

    if (completed && !isLegacyList) {
      await revertTask(taskId)
      return
    }

    if (NON_OUTREACH_TYPES.includes(type)) {
      await completeTask(taskId)
    } else {
      setCompleteModalTask(task)
    }
  }

  const handleCompleteSubmit = (count: number) => {
    if (completeModalTask) {
      const resolvedType =
        completeModalTask.flowType === TASK_TYPES.p2pDisabledText
          ? TASK_TYPES.text
          : completeModalTask.flowType
      completeTask(completeModalTask.id, {
        type: resolvedType,
        quantity: count,
      })
    }
    setCompleteModalTask(null)
  }

  const handleCompleteCancel = () => {
    setCompleteModalTask(null)
  }

  const handleActionClick = (task: Task) => {
    if (task.completed && !isLegacyList) {
      void revertTask(task.id)
      return
    }

    const { flowType, proRequired, deadline } = task
    const isTextCompliant =
      tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED

    if (NON_OUTREACH_TYPES.includes(flowType)) {
      void (async () => {
        const ok = await completeTask(task.id)
        if (ok && task.link?.startsWith('/')) {
          router.push(task.link)
        }
      })()
      return
    }

    // Normalize p2pDisabledText to text before validation/rendering
    const resolvedFlowType =
      flowType === TASK_TYPES.p2pDisabledText ? TASK_TYPES.text : flowType

    if (resolvedFlowType === TASK_TYPES.text) {
      if (!isPro) {
        setShowP2PModal(true)
        setP2PTrackingAttrs(
          buildTrackingAttrs('Upgrade to Pro', {
            viabilityScore,
            type: resolvedFlowType,
          }),
        )
        return
      }
      if (p2pUxEnabled && !isTextCompliant) {
        trackEvent(EVENTS.Outreach.P2PCompliance.ComplianceModalViewed, {
          source: 'task_list',
        })
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
          type: resolvedFlowType,
        }),
      )
      return
    }

    if (deadline && daysUntilElection < deadline) {
      setDeadlineModalTask(task)
      return
    }

    if (isValidOutreachType(resolvedFlowType)) {
      setFlowModalTask({ task, resolvedType: resolvedFlowType })
    } else {
      console.error('Unknown or unsupported outreach type:', resolvedFlowType)
      setFlowModalTask(null)
    }
  }

  const replaceTask = (taskId: string, updatedTask: Task) => {
    setTasks((currentTasks) => {
      const idx = currentTasks.findIndex((t) => t.id === taskId)
      if (idx === -1) return currentTasks
      const next = [...currentTasks]
      next[idx] = updatedTask
      return next
    })
  }

  const sendTaskUpdate = async (
    route: ApiRoute,
    taskId: string,
    errorMessage: string,
    body?: Record<string, unknown>,
  ): Promise<boolean> => {
    if (inFlightTasks.current.has(taskId)) return false
    inFlightTasks.current.add(taskId)

    let succeeded = false
    try {
      const resp = await clientFetch<Task>(route, { taskId, ...body })
      if ('ok' in resp && resp.ok) {
        replaceTask(taskId, (resp as { ok: true; data: Task }).data)
        succeeded = true
      } else {
        errorSnackbar(errorMessage)
      }
    } catch (error) {
      console.error(error)
      errorSnackbar(errorMessage)
    } finally {
      inFlightTasks.current.delete(taskId)
    }

    if (succeeded) {
      refreshAfterTaskMutation().catch(console.error)
    }
    return succeeded
  }

  const completeTask = (
    taskId: string,
    voterContact?: { type: string; quantity: number },
  ) => {
    const route = isLegacyList
      ? apiRoutes.campaign.legacyTasks.complete
      : apiRoutes.campaign.tasks.complete
    return sendTaskUpdate(
      route,
      taskId,
      'Failed to complete task',
      voterContact,
    )
  }

  const revertTask = (taskId: string) =>
    sendTaskUpdate(
      apiRoutes.campaign.tasks.revert,
      taskId,
      'Failed to mark task as incomplete',
    )

  return (
    <>
      {isLegacyList && <DashboardHeader campaign={campaign} tasks={tasks} />}
      <Card
        className={cn(
          'mb-32 gap-0',
          isLegacyList ? 'p-6' : 'p-0 font-opensans',
        )}
      >
        {isLegacyList ? (
          <>
            <H2>Tasks for this week</H2>
            <Body2 className="!font-outfit mt-1">
              Election day: {electionDate ? dateUsHelper(electionDate) : ''}
            </Body2>
          </>
        ) : (
          <>
            <div className="flex justify-between items-baseline border-b px-6 py-6">
              <div className="text-lg font-semibold font-opensans">
                Campaign plan
              </div>
            </div>
            <WeeklyTaskNavigator
              currentWeekStart={currentWeekStart}
              onPrevious={goToPrevious}
              onNext={goToNext}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
            />
          </>
        )}

        <ul>
          {(isLegacyList ? tasks : filteredTasks).length > 0 ? (
            (isLegacyList ? tasks : filteredTasks).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isPro={isPro}
                daysUntilElection={daysUntilElection}
                electionDate={electionDate}
                onCheck={handleCheckClick}
                onAction={handleActionClick}
              />
            ))
          ) : (
            <li className="flex items-center justify-center border-t border-border px-6 py-6">
              <span className="text-sm">Nothing planned for this week</span>
            </li>
          )}
        </ul>
      </Card>
      {completeModalTask &&
        ((value: Task['flowType']): value is LogTaskFlowType =>
          value in TASK_TYPE_HEADINGS)(completeModalTask.flowType) && (
          <LogTaskModal
            onSubmit={handleCompleteSubmit}
            onClose={handleCompleteCancel}
            flowType={completeModalTask.flowType}
          />
        )}
      {deadlineModalTask && deadlineModalTask.deadline !== undefined && (
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
          const isTextCompliant =
            tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED
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
      {flowModalTask && (
        <TaskFlow
          forceOpen
          type={flowModalTask.resolvedType}
          campaign={campaign}
          onClose={() => setFlowModalTask(null)}
          onComplete={async () => {
            if (!flowModalTask.task.completed) {
              await completeTask(flowModalTask.task.id)
            }
          }}
          defaultAiTemplateId={flowModalTask.task.defaultAiTemplateId}
        />
      )}
    </>
  )
}

export default TasksList
