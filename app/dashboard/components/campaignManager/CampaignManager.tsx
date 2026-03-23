'use client'

import { useEffect, useRef } from 'react'
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

  const { data: tasks = [] } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      const resp = await clientFetch<Task[]>(apiRoutes.campaign.tasks.list)
      return resp.ok ? resp.data : []
    },
    enabled: !!campaign,
  })

  useEffect(() => {
    if (tasks.length > 0 || !campaign || generatingRef.current) return

    generatingRef.current = true
    clientFetch<Task[]>(apiRoutes.campaign.tasks.generate).then((resp) => {
      if (resp.ok && resp.data.length > 0) {
        queryClient.setQueryData(TASKS_QUERY_KEY, resp.data)
      }
    })
  }, [tasks, campaign, queryClient])

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
          <LoadingState />
        </CampaignUpdateHistoryProvider>
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
      </VoterContactsProvider>
    </DashboardLayout>
  )
}
