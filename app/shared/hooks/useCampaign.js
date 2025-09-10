'use client'
import { useContext } from 'react'
import { CampaignContext } from '@shared/hooks/CampaignProvider'

export const useCampaign = () => {
  const [campaign, setCampaign, refreshCampaign] = useContext(CampaignContext)
  return [campaign, setCampaign, refreshCampaign]
}
