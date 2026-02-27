'use client'
import { useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { Campaign } from 'helpers/types'

interface CampaignFilters {
  party?: string
  state?: string
  level?: string
  results?: boolean
  office?: string
  name?: string
}

const fetchCampaigns = async (filters: CampaignFilters | null) => {
  try {
    const resp = await clientFetch<Campaign[]>(
      apiRoutes.campaign.map.list,
      filters || undefined,
      {
        revalidate: 3600,
      },
    )

    return resp.data
  } catch (err) {
    console.log(err)
    return []
  }
}

interface UseMapCampaignsReturn {
  campaigns: Campaign[]
  isCampaignsLoading: boolean
  setIsCampaignsLoading: (loading: boolean) => void
}

export const useMapCampaigns = (
  filters: CampaignFilters,
): UseMapCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false)

  useEffect(() => {
    const isFilterEmpty =
      !filters || Object.values(filters).every((val) => !val)
    setIsCampaignsLoading(true)
    loadCampaigns(isFilterEmpty ? null : filters)
  }, [filters])

  async function loadCampaigns(filters: CampaignFilters | null) {
    const campaigns = await fetchCampaigns(filters)
    setCampaigns(campaigns || [])
    setIsCampaignsLoading(false)
  }

  return { campaigns, isCampaignsLoading, setIsCampaignsLoading }
}
