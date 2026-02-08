'use client'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import WebsiteEditFlow from './WebsiteEditFlow'

interface WebsiteEditorPageProps {
  pathname: string
}

export default function WebsiteEditorPage({ pathname }: WebsiteEditorPageProps): React.JSX.Element {
  const [campaign] = useCampaign()

  return (
    <DashboardLayout
      pathname={pathname}
      campaign={campaign}
      showAlert={false}
      hideMenu
    >
      <WebsiteEditFlow />
    </DashboardLayout>
  )
}
