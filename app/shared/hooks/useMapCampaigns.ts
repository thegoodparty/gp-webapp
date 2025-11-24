'use client'
import { useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const fetchCampaigns = async (filters: Record<string, unknown> | null) => {
  try {
    const resp = await clientFetch(apiRoutes.campaign.map.list, filters || undefined, {
      revalidate: 3600,
    })

    return resp.data
  } catch (err) {
    console.log(err)
    return []
  }
}

interface UseMapCampaignsReturn {
  campaigns: unknown[]
  isCampaignsLoading: boolean
  setIsCampaignsLoading: (loading: boolean) => void
}

export const useMapCampaigns = (filters: Record<string, unknown>): UseMapCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<unknown[]>([])
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false)

  useEffect(() => {
    const isFilterEmpty =
      !filters || Object.values(filters).every((val) => !val)
    setIsCampaignsLoading(true)
    loadCampaigns(isFilterEmpty ? null : filters)
  }, [filters])

  async function loadCampaigns(filters: Record<string, unknown> | null) {
    const campaigns = await fetchCampaigns(filters)
    setCampaigns((campaigns || []) as unknown[])
    setIsCampaignsLoading(false)
  }

  return { campaigns, isCampaignsLoading, setIsCampaignsLoading }
}

