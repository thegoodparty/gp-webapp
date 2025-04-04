'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const AdminCampaignContext = createContext([{}, () => {}])

export const AdminCampaignProvider = ({ children, campaign: initCampaign }) => {
  const [campaign, setCampaign] = useState(initCampaign)
  const refreshCampaign = async () => {
    const { data: refreshedCampaign } = await clientFetch(
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
