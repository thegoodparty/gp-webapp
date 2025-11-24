'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { Campaign } from 'helpers/types'

type AdminCampaignContextValue = [
  campaign: Campaign,
  setCampaign: (campaign: Campaign) => void,
  refreshCampaign: () => Promise<void>
]

export const AdminCampaignContext = createContext<AdminCampaignContextValue>([{} as Campaign, () => {}, async () => {}])

interface AdminCampaignProviderProps {
  children: React.ReactNode
  campaign: Campaign
}

export const AdminCampaignProvider = ({ children, campaign: initCampaign }: AdminCampaignProviderProps): React.JSX.Element => {
  const [campaign, setCampaign] = useState<Campaign>(initCampaign)
  const refreshCampaign = async () => {
    const { data: refreshedCampaign } = await clientFetch<Campaign>(
      apiRoutes.campaign.findBySlug,
      {
        slug: campaign.slug,
      },
    )
    setCampaign(refreshedCampaign)
  }

  return (
    <AdminCampaignContext.Provider
      value={[campaign, setCampaign, refreshCampaign]}
    >
      {children}
    </AdminCampaignContext.Provider>
  )
}

