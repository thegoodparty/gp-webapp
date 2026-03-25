'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import DashboardLayout from 'app/dashboard/shared/DashboardLayout'
import LoadingState, { AI_CAMPAIGN_CHECKLIST_COOKIE } from './LoadingState'
import { getCookie } from 'helpers/cookieHelper'
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
  const showLoadingStateCookie = getCookie(AI_CAMPAIGN_CHECKLIST_COOKIE)
  const [showLoadingState, setShowLoadingState] = useState(
    () => !showLoadingStateCookie,
  )

  const hideLoadingChecklist = useCallback(() => {
    setShowLoadingState(false)
  }, [])

  const { data: tasks = [] } = useQuery({
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

  const { isGenerating, progress, error, startGeneration, cancelGeneration } =
    useTaskGenerationStream(onTasksReceived)

  useEffect(() => {
    if (tasks.length > 0 || !campaign || generatingRef.current) return

    generatingRef.current = true
    startGeneration()

    return () => {
      cancelGeneration()
    }
  }, [tasks, campaign, startGeneration, cancelGeneration])

  useEffect(() => {
    if (error) {
      generatingRef.current = false
    }
  }, [error])

  if (!campaign) {
    return null
  }

  const contactGoals = calculateContactGoalsFromCampaign(campaign)

  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      <VoterContactsProvider>
        <CampaignUpdateHistoryProvider>
          <HeaderSection />
          <ProgressSection />
          <LoadingState hideCallback={hideLoadingChecklist} />
          {isGenerating && progress && showLoadingState && (
            <div className="mt-4 rounded-lg border bg-white p-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                {progress.message || 'Generating AI tasks...'}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(progress.progress, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {Math.round(progress.progress)}% complete
              </p>
            </div>
          )}
          {error && !isGenerating && !showLoadingState && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                Failed to generate tasks. Please try again later.
              </p>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-primary underline"
                onClick={startGeneration}
              >
                Retry
              </button>
            </div>
          )}
          {!showLoadingState && (
            <>
              {contactGoals ? (
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
        </CampaignUpdateHistoryProvider>
      </VoterContactsProvider>
    </DashboardLayout>
  )
}
