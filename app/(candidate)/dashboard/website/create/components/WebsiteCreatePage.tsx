'use client'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import WebsiteCreateFlow from './WebsiteCreateFlow'

interface WebsiteCreatePageProps {
  pathname: string
  initialIssues?: { title: string; description: string }[]
}

export default function WebsiteCreatePage({
  pathname,
  initialIssues,
}: WebsiteCreatePageProps): React.JSX.Element {
  const [campaign] = useCampaign()

  return (
    <DashboardLayout
      pathname={pathname}
      campaign={campaign}
      showAlert={false}
      hideMenu
    >
      <WebsiteCreateFlow initialIssues={initialIssues} />
    </DashboardLayout>
  )
}
