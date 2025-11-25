'use client'
import { useContext } from 'react'
import { CampaignStatusContext } from '@shared/user/CampaignStatusProvider'

export const useCampaignStatus = () => useContext(CampaignStatusContext)

