import { useContext } from 'react'
import { AdminCampaignContext } from '@shared/hooks/AdminCampaignProvider'

export const useAdminCampaign = () => {
  const [campaign, setCampaign, refreshCampaign] =
    useContext(AdminCampaignContext)
  if (campaign === undefined) {
    throw new Error(
      'useAdminCampaign must be used within a AdminCampaignProvider',
    )
  }
  return [campaign, setCampaign, refreshCampaign]
}

