'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import { IssuesProvider } from '@shared/hooks/IssuesProvider'
import { SearchFiltersProvider } from '@shared/hooks/SearchFiltersProvider'
import IssuesHeader from './IssuesHeader'
import EmptyIssueState from './EmptyIssueState'
import IssueList from './IssueList'
import SearchContainer from './SearchContainer'

export default function IssuesPage({
  pathname,
  campaign: initCampaign,
  issues,
}) {
  const [campaign] = useCampaign(initCampaign)

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <IssuesProvider issues={issues}>
        <SearchFiltersProvider>
          <IssuesHeader />
          <SearchContainer />
          {issues?.length === 0 ? <EmptyIssueState /> : <IssueList />}
        </SearchFiltersProvider>
      </IssuesProvider>
    </DashboardLayout>
  )
}
