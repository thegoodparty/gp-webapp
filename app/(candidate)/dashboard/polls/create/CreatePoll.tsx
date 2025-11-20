'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import DashboardLayout from '../../shared/DashboardLayout'

export const CreatePoll: React.FC<{ pathname: string }> = ({ pathname }) => {
  const [campaign] = useCampaign()
  return (
    <DashboardLayout pathname={pathname} campaign={campaign} showAlert={false}>
      <div>This will be an awesome poll creation experience!</div>
    </DashboardLayout>
  )
}
