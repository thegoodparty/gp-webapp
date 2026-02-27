import { useContext } from 'react'
import { AdminCampaignContext } from '@shared/hooks/AdminCampaignProvider'
import { Campaign } from 'helpers/types'

type UseAdminCampaignReturn = [
  campaign: Campaign | null,
  setCampaign: (campaign: Campaign) => void,
  refreshCampaign: () => Promise<void>,
]

export const useAdminCampaign = (): UseAdminCampaignReturn => {
  const [campaign, setCampaign, refreshCampaign] =
    useContext(AdminCampaignContext)
  if (campaign === undefined) {
    throw new Error(
      'useAdminCampaign must be used within a AdminCampaignProvider',
    )
  }
  return [campaign, setCampaign, refreshCampaign]
}
