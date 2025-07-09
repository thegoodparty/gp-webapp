'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import { IssuesProvider } from '@shared/hooks/IssuesProvider'
import { SearchFiltersProvider } from '@shared/hooks/SearchFiltersProvider'
import { ViewModeProvider } from '@shared/hooks/ViewModeProvider'
import IssuesHeader from './IssuesHeader'
import IssuesContainer from './IssuesContainer'
import SearchContainer from './search/SearchContainer'

export default function IssuesPage({
  pathname,
  campaign: initCampaign,
  issues,
}) {
  const [campaign] = useCampaign(initCampaign)
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
