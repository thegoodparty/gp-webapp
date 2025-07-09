'use client'
import DashboardLayout from '../../../shared/DashboardLayout'
import { useCampaign } from '@shared/hooks/useCampaign'
import WebsiteEditFlow from './WebsiteEditFlow'

export default function WebsiteEditorPage({ pathname }) {
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
