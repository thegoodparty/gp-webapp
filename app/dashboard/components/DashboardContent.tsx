'use client'

import type { Task } from './tasks/TaskItem'
import type { TcrCompliance } from 'helpers/types'
import CampaignManager from './campaignManager/CampaignManager'

interface DashboardContentProps {
  pathname: string
  tasks: Task[]
  tcrCompliance: TcrCompliance | null
}

export default function DashboardContent({
  pathname,
  tcrCompliance,
}: DashboardContentProps): React.JSX.Element {
  return <CampaignManager pathname={pathname} tcrCompliance={tcrCompliance} />
}
