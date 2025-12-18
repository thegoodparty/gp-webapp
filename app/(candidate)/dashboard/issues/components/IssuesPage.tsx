'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { IssuesProvider } from '@shared/hooks/IssuesProvider'
import { SearchFiltersProvider } from '@shared/hooks/SearchFiltersProvider'
import { ViewModeProvider } from '@shared/hooks/ViewModeProvider'
import IssuesHeader from './IssuesHeader'
import IssuesContainer from './IssuesContainer'
import SearchContainer from './search/SearchContainer'

import { IssueStatus, IssueChannel } from '@shared/hooks/IssuesProvider'

interface Campaign {
  id: number
  slug: string
}

interface CommunityIssue {
  uuid: string
  createdAt: Date | string
  updatedAt: Date | string
  title: string
  description: string
  status: IssueStatus
  channel: IssueChannel
  attachments: string[]
  campaignId: number
}

interface IssuesPageProps {
  pathname: string
  campaign: Campaign
  issues: CommunityIssue[]
}

export default function IssuesPage({
  pathname,
  campaign,
  issues,
}: IssuesPageProps): React.JSX.Element {
  const initFilters = { status: 'all', search: '' }

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <IssuesProvider issues={issues}>
        <SearchFiltersProvider initFilters={initFilters}>
          <ViewModeProvider>
            <IssuesHeader />
            <SearchContainer />
            <IssuesContainer />
          </ViewModeProvider>
        </SearchFiltersProvider>
      </IssuesProvider>
    </DashboardLayout>
  )
}
