'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import { IssuesProvider } from '@shared/hooks/IssuesProvider'
import IssuesHeader from './IssuesHeader'
import EmptyIssueState from './EmptyIssueState'

export default function IssuesPage({
  pathname,
  campaign: initCampaign,
  issues,
}) {
  const [campaign] = useCampaign(initCampaign)

  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <IssuesProvider issues={issues}>
        <IssuesHeader />
        {issues?.length === 0 && <EmptyIssueState />}
      </IssuesProvider>
    </DashboardLayout>
  )
}
