import { createContext, useCallback, useEffect, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

const INITIAL_UPDATE_HISTORY_STATE = []

export const CampaignUpdateHistoryContext = createContext([
  INITIAL_UPDATE_HISTORY_STATE,
  (_newValues) => [],
])

export const CampaignUpdateHistoryProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_UPDATE_HISTORY_STATE)

  const loadHistory = async () => {
    try {
      const resp = await clientFetch(
        apiRoutes.campaign.updateHistory.list,
        undefined,
        { revalidate: 3 }, // 3 seconds cache to prevent multiple calls on load
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
    (next) => {
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
