'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

type AdminCampaignContextValue = [
  campaign: never,
  setCampaign: (campaign: never) => void,
  refreshCampaign: () => Promise<void>
]

export const AdminCampaignContext = createContext<AdminCampaignContextValue>([{} as never, () => {}, async () => {}])

interface AdminCampaignProviderProps {
  children: React.ReactNode
  campaign: never
}

export const AdminCampaignProvider = ({ children, campaign: initCampaign }: AdminCampaignProviderProps): React.JSX.Element => {
  const [campaign, setCampaign] = useState<never>(initCampaign)
  const refreshCampaign = async () => {
    const { data: refreshedCampaign } = await clientFetch(
      apiRoutes.campaign.findBySlug,
      {
        slug: ((campaign as never) as { slug: string }).slug,
      },
    )
    setCampaign(refreshedCampaign as never)
  }

  return (
    <AdminCampaignContext.Provider
      value={[campaign, setCampaign, refreshCampaign]}
    >
      {children}
    </AdminCampaignContext.Provider>
  )
}

