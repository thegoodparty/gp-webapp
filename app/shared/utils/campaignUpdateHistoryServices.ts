import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { getUserFullName } from '@shared/utils/getUserFullName'
import { User } from 'helpers/types'

type CampaignUpdateHistoryType =
  | 'doorKnocking'
  | 'calls'
  | 'digital'
  | 'directMail'
  | 'digitalAds'
  | 'text'
  | 'events'
  | 'yardSigns'
  | 'robocall'
  | 'phoneBanking'
  | 'socialMedia'

interface CampaignUpdateHistory {
  id: number
  createdAt: string
  updatedAt: string
  campaignId: number
  userId: number
  type: CampaignUpdateHistoryType
  quantity: number
}

interface CampaignUpdateHistoryWithUser extends CampaignUpdateHistory {
  user: {
    id: number
    name: string
    avatar?: string
  }
}

export const deleteUpdateHistory = async (id: number): Promise<CampaignUpdateHistory> => {
  const resp = await clientFetch<CampaignUpdateHistory>(apiRoutes.campaign.updateHistory.delete, {
    id,
  })
  return resp.data
}

export const createUpdateHistory = async (
  payload: Record<string, unknown>,
): Promise<CampaignUpdateHistory> => {
  const resp = await clientFetch<CampaignUpdateHistory>(
    apiRoutes.campaign.updateHistory.create,
    payload,
  )
  return resp.data
}

export const createIrresponsiblyMassagedHistoryItem = (
  historyItem: CampaignUpdateHistory,
  user: User,
): CampaignUpdateHistoryWithUser => ({
  ...historyItem,
  user: {
    id: user.id,
    name: getUserFullName(user),
    ...(user.avatar ? { avatar: user.avatar } : {}),
  },
})

