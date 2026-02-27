import { createContext, useCallback, useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import {
  CampaignUpdateHistory,
  CampaignUpdateHistoryWithUser,
  CampaignUpdateHistoryType,
} from '@shared/utils/campaignUpdateHistoryServices'

export type {
  CampaignUpdateHistory,
  CampaignUpdateHistoryWithUser,
  CampaignUpdateHistoryType,
}

const INITIAL_UPDATE_HISTORY_STATE: CampaignUpdateHistoryWithUser[] = []

type CampaignUpdateHistoryContextValue = [
  state: CampaignUpdateHistoryWithUser[],
  updateState: (
    next:
      | CampaignUpdateHistoryWithUser[]
      | ((
          prev: CampaignUpdateHistoryWithUser[],
        ) => CampaignUpdateHistoryWithUser[]),
  ) => void,
]

export const CampaignUpdateHistoryContext =
  createContext<CampaignUpdateHistoryContextValue>([
    INITIAL_UPDATE_HISTORY_STATE,
    () => [],
  ])

interface CampaignUpdateHistoryProviderProps {
  children: React.ReactNode
}

export const CampaignUpdateHistoryProvider = ({
  children,
}: CampaignUpdateHistoryProviderProps): React.JSX.Element => {
  const [state, setState] = useState<CampaignUpdateHistoryWithUser[]>(
    INITIAL_UPDATE_HISTORY_STATE,
  )

  const loadHistory = async () => {
    try {
      const resp = await clientFetch<CampaignUpdateHistoryWithUser[]>(
        apiRoutes.campaign.updateHistory.list,
        undefined,
        { revalidate: 3 },
      )
      setState(resp.data || [])
    } catch (e) {
      console.log('error at fetchUpdateHistory', e)
      setState([])
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const updateState = useCallback(
    (
      next:
        | CampaignUpdateHistoryWithUser[]
        | ((
            prev: CampaignUpdateHistoryWithUser[],
          ) => CampaignUpdateHistoryWithUser[]),
    ) => {
      const newValues = typeof next === 'function' ? next(state) : next
      setState(newValues)
    },
    [state],
  )

  return (
    <CampaignUpdateHistoryContext.Provider value={[state, updateState]}>
      {children}
    </CampaignUpdateHistoryContext.Provider>
  )
}
