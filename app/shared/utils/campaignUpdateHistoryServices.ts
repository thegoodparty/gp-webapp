import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { getUserFullName } from '@shared/utils/getUserFullName'
import { User } from 'helpers/types'

interface HistoryItem {
  id?: number
  [key: string]: unknown
}

interface HistoryItemWithUser extends HistoryItem {
  user: {
    id: number
    name: string
    avatar?: string
  }
}

export const deleteUpdateHistory = async (id: number): Promise<HistoryItem> => {
  const resp = await clientFetch<HistoryItem>(apiRoutes.campaign.updateHistory.delete, {
    id,
  })
  return resp.data
}

export const createUpdateHistory = async (
  payload: Record<string, unknown>,
): Promise<HistoryItem> => {
  const resp = await clientFetch<HistoryItem>(
    apiRoutes.campaign.updateHistory.create,
    payload,
  )
  return resp.data
}

export const createIrresponsiblyMassagedHistoryItem = (
  historyItem: HistoryItem,
  user: User,
): HistoryItemWithUser => ({
  ...historyItem,
  user: {
    id: user.id,
    name: getUserFullName(user),
    ...(user.avatar ? { avatar: user.avatar } : {}),
  },
})

