'use client'
import { useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const fetchCampaigns = async (filters) => {
  try {
    const resp = await clientFetch(apiRoutes.campaign.map.list, filters, {
      revalidate: 3600,
    })

    return resp.data
  } catch (err) {
    console.log(err)
    return []
  }
}

export const useMapCampaigns = (filters) => {
  const [campaigns, setCampaigns] = useState([])
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false)

  useEffect(() => {
    const isFilterEmpty =
      !filters || Object.values(filters).every((val) => !val)
    setIsCampaignsLoading(true)
    loadCampaigns(isFilterEmpty ? null : filters)
  }, [filters])

  async function loadCampaigns(filters) {
    const campaigns = await fetchCampaigns(filters)
    setCampaigns(campaigns || [])
    setIsCampaignsLoading(false)
  }

  return { campaigns, isCampaignsLoading, setIsCampaignsLoading }
}
