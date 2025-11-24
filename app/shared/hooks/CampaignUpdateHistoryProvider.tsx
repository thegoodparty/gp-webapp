import { createContext, useCallback, useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface CampaignUpdateHistory {
  id: string
  timestamp: string
}

const INITIAL_UPDATE_HISTORY_STATE: CampaignUpdateHistory[] = []

type CampaignUpdateHistoryContextValue = [
  state: CampaignUpdateHistory[],
  updateState: (next: CampaignUpdateHistory[] | ((prev: CampaignUpdateHistory[]) => CampaignUpdateHistory[])) => void
]

export const CampaignUpdateHistoryContext = createContext<CampaignUpdateHistoryContextValue>([
  INITIAL_UPDATE_HISTORY_STATE,
  () => [],
])

interface CampaignUpdateHistoryProviderProps {
  children: React.ReactNode
}

export const CampaignUpdateHistoryProvider = ({ children }: CampaignUpdateHistoryProviderProps): React.JSX.Element => {
  const [state, setState] = useState<CampaignUpdateHistory[]>(INITIAL_UPDATE_HISTORY_STATE)

  const loadHistory = async () => {
    try {
      const resp = await clientFetch<CampaignUpdateHistory[]>(
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
    (next: CampaignUpdateHistory[] | ((prev: CampaignUpdateHistory[]) => CampaignUpdateHistory[])) => {
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

