'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

type EcanvasserSurveyContextValue = [
  survey: Record<string, never>,
  refreshSurvey: () => Promise<void>
]

export const EcanvasserSurveyContext = createContext<EcanvasserSurveyContextValue>([{}, async () => {}])

interface EcanvasserSurveyProviderProps {
  children: React.ReactNode
  survey: Record<string, never>
}

export const EcanvasserSurveyProvider = ({ children, survey: initialSurvey }: EcanvasserSurveyProviderProps): React.JSX.Element => {
  const [survey, setSurvey] = useState<Record<string, never>>(initialSurvey)

  const refreshSurvey = async () => {
    try {
      const resp = await clientFetch(apiRoutes.ecanvasser.surveys.find, {
        id: ((survey as never) as { id?: string })?.id,
      })

      setSurvey(resp?.status === 404 ? {} : (resp.data as Record<string, never>))
    } catch (e) {
      console.error('error fetching ecanvasser', e)
      setSurvey({})
    }
  }

  return (
    <EcanvasserSurveyContext.Provider value={[survey, refreshSurvey]}>
      {children}
    </EcanvasserSurveyContext.Provider>
  )
}

