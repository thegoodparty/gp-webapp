import { createContext, useCallback, useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const INITIAL_UPDATE_HISTORY_STATE: never[] = []

type CampaignUpdateHistoryContextValue = [
  state: never[],
  updateState: (next: never[] | ((prev: never[]) => never[])) => void
]

export const CampaignUpdateHistoryContext = createContext<CampaignUpdateHistoryContextValue>([
  INITIAL_UPDATE_HISTORY_STATE,
  () => [],
])

interface CampaignUpdateHistoryProviderProps {
  children: React.ReactNode
}

export const CampaignUpdateHistoryProvider = ({ children }: CampaignUpdateHistoryProviderProps): React.JSX.Element => {
  const [state, setState] = useState<never[]>(INITIAL_UPDATE_HISTORY_STATE)

  const loadHistory = async () => {
    try {
      const resp = await clientFetch(
        apiRoutes.campaign.updateHistory.list,
        undefined,
        { revalidate: 3 },
      )
      setState((resp.data as never[]) || [])
    } catch (e) {
      console.log('error at fetchUpdateHistory', e)
      setState([])
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const updateState = useCallback(
    (next: never[] | ((prev: never[]) => never[])) => {
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

