'use client'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
import CountModal from './CountModal'
import EventDetailModal from './EventDetailModal'
import AwarenessDetailModal from './AwarenessDetailModal'
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
import {
  formatTaskDate,
  getCampaignPlanEventTaskType,
  NAV_DIRECTIONS,
  STATUS_CHANGES,
  TASK_TYPES,
  TRACKING_SOURCES,
  VIEW_MODES,
  WEEK_POSITIONS,
} from '../../shared/constants/tasks.const'
import type {
  StatusChange,
  TrackingSource,
  ViewMode,
  WeekPosition,
} from '../../shared/constants/tasks.const'
import { addWeeks, differenceInDays } from 'date-fns'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'
import WeeklyTaskNavigator, { formatWeekLabel } from './WeeklyTaskNavigator'
import { useWeekNavigation } from './useWeekNavigation'
import { useP2pUxEnabled } from 'app/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'
import { Campaign, TcrCompliance } from 'helpers/types'
import { useUser } from '@shared/hooks/useUser'
import { isValidOutreachType } from 'app/dashboard/outreach/util/getEffectiveOutreachType'
import type { OutreachType } from 'gpApi/outreach.api'
import { useQueryClient } from '@tanstack/react-query'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import {
  getVoterContactField,
  type VoterContactsState,
} from '@shared/hooks/VoterContactsProvider'
import { useCampaignUpdateHistory } from '@shared/hooks/useCampaignUpdateHistory'
import type { CampaignUpdateHistoryWithUser } from '@shared/hooks/CampaignUpdateHistoryProvider'
import { Card, cn } from '@styleguide'

const NON_OUTREACH_TYPES = [
  TASK_TYPES.education,
  TASK_TYPES.events,
  TASK_TYPES.compliance,
  TASK_TYPES.awareness,
  TASK_TYPES.recurring,
]

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

type TaskId = Task['id']

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

  const { details, hasFreeTextsOffer } = campaign
  const isPro = campaign.isPro ?? false
  const { electionDate } = details ?? {}
  const vendorP2v = campaign.vendorTsData?.['pathToVictory'] as
    | { viability?: { score?: number } }
    | undefined
  const viabilityScore = vendorP2v?.viability?.score || 0
  const electionDateObj =
    typeof electionDate === 'string' && electionDate
      ? new Date(electionDate.replace(/-/g, '/'))
      : null
  const daysUntilElection = electionDateObj
    ? differenceInDays(electionDateObj, new Date())
    : Infinity

  const {
    selectedWeek,
    weeksUntilElection,
    previousWeekNumber,
    nextWeekNumber,
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

  const viewModeSessionKey = `campaign-plan-view-mode:${campaign.id}`

  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.weekly)

  useIsomorphicLayoutEffect(() => {
    const stored = sessionStorage.getItem(viewModeSessionKey)
    setViewMode(
      stored === VIEW_MODES.full ? VIEW_MODES.full : VIEW_MODES.weekly,
    )
  }, [viewModeSessionKey])

  const handleToggleViewMode = () => {
    const newMode =
      viewMode === VIEW_MODES.weekly ? VIEW_MODES.full : VIEW_MODES.weekly
    setViewMode(newMode)
    sessionStorage.setItem(viewModeSessionKey, newMode)
    trackEvent(EVENTS.Dashboard.CampaignPlan.ViewModeToggled, {
      viewMode: newMode,
    })
  }

  const tasksByWeek = useMemo(() => {
    const groups = new Map<number, Task[]>()
    for (const task of tasks) {
      const existing = groups.get(task.week)
      if (existing) {
        existing.push(task)
      } else {
        groups.set(task.week, [task])
      }
    }
    if (
      Number.isFinite(weeksUntilElection) &&
      !groups.has(weeksUntilElection)
    ) {
      groups.set(weeksUntilElection, [])
    }
    return [...groups.entries()].sort(([a], [b]) => b - a)
  }, [tasks, weeksUntilElection])

  const getWeekRelativePosition = (week: number): WeekPosition => {
    if (week > weeksUntilElection) return WEEK_POSITIONS.past
    if (week < weeksUntilElection) return WEEK_POSITIONS.future
    return WEEK_POSITIONS.current
  }

  const handlePreviousWeek = () => {
    if (previousWeekNumber !== null) {
      trackEvent(EVENTS.Dashboard.CampaignPlan.WeekNavigated, {
        direction: NAV_DIRECTIONS.previous,
        weekRelativePosition: getWeekRelativePosition(previousWeekNumber),
      })
    }
    goToPrevious()
  }

  const handleNextWeek = () => {
    if (nextWeekNumber !== null) {
      trackEvent(EVENTS.Dashboard.CampaignPlan.WeekNavigated, {
        direction: NAV_DIRECTIONS.next,
        weekRelativePosition: getWeekRelativePosition(nextWeekNumber),
      })
    }
    goToNext()
  }

  const [user] = useUser()

  const tasksCount = tasks.length
  const tasksCompletedCount = tasks.filter((t) => t.completed).length
  const viewedPayloadRef = useRef<{
    viewMode: ViewMode
    tasksThisWeek: number
    tasksCompletedThisWeek: number
  }>({
    viewMode: VIEW_MODES.weekly,
    tasksThisWeek: 0,
    tasksCompletedThisWeek: 0,
  })
  const isFullView = viewMode === VIEW_MODES.full
  viewedPayloadRef.current = {
    viewMode,
    tasksThisWeek: isFullView ? tasksCount : filteredTasks.length,
    tasksCompletedThisWeek: isFullView
      ? tasksCompletedCount
      : filteredTasks.filter((t) => t.completed).length,
  }

  const trackedWeekRef = useRef<string | null>(null)

  useEffect(() => {
    if (isLegacyList || tasksCount === 0) return
    const trackedWeekKey = `${campaign.id}:${viewMode}:${selectedWeek}`
    if (trackedWeekRef.current === trackedWeekKey) return
    trackedWeekRef.current = trackedWeekKey
    trackEvent(EVENTS.Dashboard.CampaignPlan.Viewed, viewedPayloadRef.current)
  }, [campaign.id, isLegacyList, selectedWeek, tasksCount, viewMode])

  useEffect(() => {
    if (isLegacyList || tasksCount === 0 || !user?.id) return
    void identifyUser(user.id, {
      campaignPlanTasksTotal: tasksCount,
      campaignPlanTasksCompleted: tasksCompletedCount,
    })
  }, [isLegacyList, tasksCount, tasksCompletedCount, user?.id])

  const [completeModalTask, setCompleteModalTask] = useState<Task | null>(null)
  const [eventDetailTask, setEventDetailTask] = useState<Task | null>(null)
  const [awarenessDetail, setAwarenessDetail] = useState<{
    task: Task
    formattedDate: string
  } | null>(null)
  const taskCountsRef = useRef<
    Partial<Record<TaskId, { field: keyof VoterContactsState; count: number }>>
  >({})
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
  const [, , updateVoterContactsLocal] = useVoterContacts()
  const inFlightTasks = useRef(new Set<TaskId>())

  const refreshAfterTaskMutation = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEY })
      const resp = await clientFetch<CampaignUpdateHistoryWithUser[]>(
        apiRoutes.campaign.updateHistory.list,
      )
      if (resp && typeof resp === 'object' && 'ok' in resp && resp.ok) {
        setUpdateHistory(resp.data || [])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const trackTaskStatusUpdate = (
    task: Task,
    statusChange: StatusChange,
    source: TrackingSource,
  ) => {
    if (isLegacyList) return
    const campaignPlanTaskType = getCampaignPlanEventTaskType(task.flowType)
    const taskDueDate = task.date ?? null
    const daysFromDueDate = taskDueDate
      ? differenceInDays(new Date(), new Date(taskDueDate.replace(/-/g, '/')))
      : null
    if (campaignPlanTaskType) {
      trackEvent(EVENTS.Dashboard.CampaignPlan.TaskStatusUpdated, {
        statusChange,
        taskType: campaignPlanTaskType,
        taskName: task.title,
        taskDueDate,
        daysFromDueDate,
        source,
      })
    }
  }

  const handleCheckClick = async (task: Task) => {
    const { id: taskId, flowType: type, completed } = task

    if (completed && !isLegacyList) {
      const saved = taskCountsRef.current[taskId]
      if (saved) {
        updateVoterContactsLocal((prev) => ({
          ...prev,
          [saved.field]: Math.max((prev[saved.field] || 0) - saved.count, 0),
        }))
        delete taskCountsRef.current[taskId]
      }
      const ok = await revertTask(taskId)
      if (ok) {
        trackTaskStatusUpdate(
          task,
          STATUS_CHANGES.incomplete,
          TRACKING_SOURCES.manualCheckoff,
        )
      } else if (saved) {
        const { field, count } = saved
        updateVoterContactsLocal((prev) => ({
          ...prev,
          [field]: (prev[field] || 0) + count,
        }))
        taskCountsRef.current[taskId] = { field, count }
      }
      return
    }

    if (
      NON_OUTREACH_TYPES.includes(type) &&
      (isLegacyList || type !== TASK_TYPES.events)
    ) {
      const ok = await completeTask(taskId)
      if (ok) {
        trackTaskStatusUpdate(
          task,
          STATUS_CHANGES.complete,
          TRACKING_SOURCES.manualCheckoff,
        )
      }
    } else {
      setCompleteModalTask(task)
    }
  }

  const handleCompleteSubmit = async (count: number) => {
    if (!completeModalTask) return

    const task = completeModalTask
    const isRecurring = task.flowType === TASK_TYPES.recurring
    const resolvedType =
      task.flowType === TASK_TYPES.p2pDisabledText
        ? TASK_TYPES.text
        : task.flowType

    let fieldForRollback: keyof VoterContactsState | undefined
    if (!isLegacyList && !isRecurring) {
      const field = getVoterContactField(resolvedType)
      fieldForRollback = field
      updateVoterContactsLocal((prev) => ({
        ...prev,
        [field]: (prev[field] || 0) + count,
      }))
      taskCountsRef.current[task.id] = { field, count }
    }

    const ok = await completeTask(task.id, {
      type: resolvedType,
      quantity: count,
    })

    if (ok) {
      trackTaskStatusUpdate(
        task,
        STATUS_CHANGES.complete,
        TRACKING_SOURCES.manualCheckoff,
      )
      setCompleteModalTask(null)
    } else if (fieldForRollback !== undefined) {
      const f = fieldForRollback
      updateVoterContactsLocal((prev) => ({
        ...prev,
        [f]: Math.max((prev[f] || 0) - count, 0),
      }))
      delete taskCountsRef.current[task.id]
    }
  }

  const handleCompleteCancel = () => {
    setCompleteModalTask(null)
  }

  const handleActionClick = (task: Task) => {
    const { flowType, proRequired, deadline } = task

    if (
      flowType === TASK_TYPES.awareness ||
      flowType === TASK_TYPES.recurring
    ) {
      setAwarenessDetail({
        task,
        formattedDate: formatTaskDate(task.date, electionDate, deadline),
      })
      return
    }

    if (task.completed && !isLegacyList) {
      const href = task.link
      if (href?.startsWith('/')) {
        router.push(href)
      }
      return
    }

    if (!isLegacyList) {
      const campaignPlanTaskType = getCampaignPlanEventTaskType(flowType)
      if (campaignPlanTaskType) {
        trackEvent(EVENTS.Dashboard.CampaignPlan.TaskCTAClicked, {
          taskType: campaignPlanTaskType,
        })
      }
    }

    const isTextCompliant =
      tcrCompliance?.status === TCR_COMPLIANCE_STATUS.APPROVED

    if (!isLegacyList && flowType === TASK_TYPES.events) {
      setEventDetailTask(task)
      return
    }

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
      void refreshAfterTaskMutation().catch(console.error)
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
            <Body2 className="font-outfit! mt-1">
              Election day: {electionDate ? dateUsHelper(electionDate) : ''}
            </Body2>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-y-1 justify-between items-baseline border-b px-6 py-6">
              <div className="text-lg font-semibold font-opensans">
                Campaign plan
              </div>
              <button
                type="button"
                className="text-sm font-semibold font-opensans text-blue-600 hover:text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600 rounded-sm"
                onClick={handleToggleViewMode}
                aria-label={
                  viewMode === VIEW_MODES.weekly
                    ? 'View all weeks'
                    : 'View current week only'
                }
              >
                {viewMode === VIEW_MODES.weekly ? 'View all' : 'View weekly'}
              </button>
            </div>
            {viewMode === VIEW_MODES.weekly && (
              <WeeklyTaskNavigator
                currentWeekStart={currentWeekStart}
                onPrevious={handlePreviousWeek}
                onNext={handleNextWeek}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />
            )}
          </>
        )}

        {!isLegacyList && viewMode === VIEW_MODES.full ? (
          tasks.length > 0 ? (
            tasksByWeek.map(([weekNum, weekTasks]) => {
              const isThisWeek =
                Number.isFinite(weeksUntilElection) &&
                weekNum === weeksUntilElection
              const weekStart = electionDateObj
                ? addWeeks(electionDateObj, -weekNum)
                : null
              return (
                <div key={weekNum}>
                  <div
                    className={cn(
                      'flex items-center bg-muted px-6 py-3',
                      isThisWeek && 'border-l-[6px] border-slate-500',
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm font-opensans',
                        isThisWeek ? 'font-semibold' : 'font-normal',
                      )}
                    >
                      {isThisWeek
                        ? 'This week'
                        : weekStart
                        ? formatWeekLabel(weekStart)
                        : `Week ${weekNum}`}
                    </span>
                  </div>
                  <ul className="border-b border-border">
                    {weekTasks.length > 0 ? (
                      weekTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          isPro={isPro}
                          isLegacyList={isLegacyList}
                          tcrCompliance={tcrCompliance}
                          daysUntilElection={daysUntilElection}
                          electionDate={electionDate}
                          onCheck={handleCheckClick}
                          onAction={handleActionClick}
                        />
                      ))
                    ) : (
                      <li className="flex items-center justify-center px-6 py-6">
                        <span className="text-sm">
                          Nothing planned for this week
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              )
            })
          ) : (
            <div className="flex items-center justify-center px-6 py-6">
              <span className="text-sm">No tasks in the campaign plan</span>
            </div>
          )
        ) : (
          <ul>
            {(isLegacyList ? tasks : filteredTasks).length > 0 ? (
              (isLegacyList ? tasks : filteredTasks).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isPro={isPro}
                  isLegacyList={isLegacyList}
                  tcrCompliance={tcrCompliance}
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
        )}
      </Card>
      {completeModalTask &&
        (isLegacyList ? (
          ((value: Task['flowType']): value is LogTaskFlowType =>
            value in TASK_TYPE_HEADINGS)(completeModalTask.flowType) && (
            <LogTaskModal
              onSubmit={handleCompleteSubmit}
              onClose={handleCompleteCancel}
              flowType={completeModalTask.flowType}
            />
          )
        ) : (
          <CountModal
            open={true}
            onOpenChange={(open) => {
              if (!open) handleCompleteCancel()
            }}
            flowType={completeModalTask.flowType}
            onSubmit={handleCompleteSubmit}
          />
        ))}
      {eventDetailTask && (
        <EventDetailModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setEventDetailTask(null)
          }}
          task={eventDetailTask}
        />
      )}
      {awarenessDetail && (
        <AwarenessDetailModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setAwarenessDetail(null)
          }}
          task={awarenessDetail.task}
          formattedDate={awarenessDetail.formattedDate}
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
              const ok = await completeTask(flowModalTask.task.id)
              if (ok) {
                trackTaskStatusUpdate(
                  flowModalTask.task,
                  STATUS_CHANGES.complete,
                  TRACKING_SOURCES.schedulingFlow,
                )
              }
            }
          }}
          defaultAiTemplateId={flowModalTask.task.defaultAiTemplateId}
        />
      )}
    </>
  )
}

export default TasksList
