'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import LoadingState from './LoadingState'
import HeaderSection from './HeaderSection'
import { useCampaign } from '@shared/hooks/useCampaign'
import ProgressSection from './ProgressSection'
import { VoterContactsProvider } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryProvider } from '@shared/hooks/CampaignUpdateHistoryProvider'
import { calculateContactGoalsFromCampaign } from '../voterGoalsHelpers'
import EmptyState from '../EmptyState'
import type { Task } from '../tasks/TaskItem'
import { TcrCompliance } from 'helpers/types'
import TasksList from '../tasks/TasksList'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { useTaskGenerationStream } from './useTaskGenerationStream'
import { FailedToGenerate } from './FailedToGenerate'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

const TASKS_QUERY_KEY = ['campaignTasks']

export default function CampaignManager({
  pathname,
  tcrCompliance,
}: {
  pathname: string
  tcrCompliance: TcrCompliance | null
}) {
  const [campaign] = useCampaign()
  const queryClient = useQueryClient()
  const generatingRef = useRef(false)
  const generatedInSessionRef = useRef(false)
  const trackedGenerationCompleteRef = useRef(false)
  const [showLoadingState, setShowLoadingState] = useState(false)

  const hideLoadingChecklist = useCallback(() => {
    setShowLoadingState(false)
  }, [])

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const resp = await clientFetch<Task[]>(apiRoutes.campaign.tasks.list)
      return resp.ok ? resp.data : []
    },
    enabled: !!campaign,
  })

  const onTasksReceived = useCallback(
    (generatedTasks: Task[]) => {
      if (generatedTasks.length > 0) {
        queryClient.setQueryData(TASKS_QUERY_KEY, generatedTasks)
      }
    },
    [queryClient],
  )

  const { isGenerating, error, startGeneration, cancelGeneration } =
    useTaskGenerationStream(onTasksReceived)

  useEffect(() => {
    if (isGenerating) {
      generatedInSessionRef.current = true
      trackedGenerationCompleteRef.current = false
      setShowLoadingState(true)
    }
  }, [isGenerating])

  useEffect(() => {
    if (isLoadingTasks) return
    if (tasks.length > 0) {
      generatingRef.current = false
      return
    }
    if (!campaign || generatingRef.current) return

    generatingRef.current = true
    void startGeneration()

    return () => {
      generatingRef.current = false
      cancelGeneration()
    }
  }, [isLoadingTasks, tasks, campaign, startGeneration, cancelGeneration])

  useEffect(() => {
    if (error) {
      generatingRef.current = false
      setShowLoadingState(false)
    }
  }, [error])

  useEffect(() => {
    if (
      !showLoadingState &&
      tasks.length > 0 &&
      generatedInSessionRef.current &&
      !trackedGenerationCompleteRef.current
    ) {
      trackEvent(EVENTS.Dashboard.CampaignPlan.GenerationCompleted)
      trackedGenerationCompleteRef.current = true
    }
  }, [showLoadingState, tasks.length])

  if (!campaign) {
    return null
  }

  const contactGoals = calculateContactGoalsFromCampaign(campaign)
  const isStreamComplete =
    !isGenerating && !error && generatedInSessionRef.current

  return (
    <DashboardLayout
      pathname={pathname}
      campaign={campaign}
      wrapperClassName="!p-0"
    >
      <VoterContactsProvider>
        <CampaignUpdateHistoryProvider>
          <div className="mx-auto w-full max-w-160 flex flex-col gap-6 px-4 py-8 md:px-0">
            <HeaderSection />
            <ProgressSection />
            {showLoadingState && (
              <LoadingState
                isStreamComplete={isStreamComplete}
                hideCallback={hideLoadingChecklist}
              />
            )}
            {error && !isGenerating && !showLoadingState && (
              <FailedToGenerate retryGeneration={startGeneration} />
            )}
            {!showLoadingState && (
              <>
                {tasks.length > 0 || contactGoals ? (
                  <TasksList
                    campaign={campaign}
                    tasks={tasks}
                    tcrCompliance={tcrCompliance}
                    isLegacyList={false}
                  />
                ) : (
                  <div className="mt-4">
                    <EmptyState />
                  </div>
                )}
              </>
            )}
          </div>
        </CampaignUpdateHistoryProvider>
      </VoterContactsProvider>
    </DashboardLayout>
  )
}
