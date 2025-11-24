import { useContext } from 'react'
import { CampaignUpdateHistoryContext } from '@shared/hooks/CampaignUpdateHistoryProvider'

export const useCampaignUpdateHistory = () => useContext(CampaignUpdateHistoryContext)

