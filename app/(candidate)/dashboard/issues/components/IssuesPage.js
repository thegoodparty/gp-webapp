'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import { IssuesProvider } from '@shared/hooks/IssuesProvider'
import IssuesHeader from './IssuesHeader'
import EmptyIssueState from './EmptyIssueState'

export default function IssuesPage({
  pathname,
  campaign: propCampaign,
  issues,
}) {
  const [hookCampaign] = useCampaign()

  const campaign = hookCampaign ?? propCampaign

  return (
    <IssuesProvider issues={issues}>
      <DashboardLayout
        pathname={pathname}
        campaign={campaign}
        showAlert={false}
      >
        <IssuesHeader />
        <EmptyIssueState />
      </DashboardLayout>
    </IssuesProvider>
  )
}
