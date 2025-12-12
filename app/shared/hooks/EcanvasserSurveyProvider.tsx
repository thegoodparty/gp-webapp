'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export interface EcanvasserSurvey {
  id: string
  name?: string
  description?: string
  [key: string]: string | number | boolean | object | null | undefined
}

type EcanvasserSurveyContextValue = [
  survey: EcanvasserSurvey,
  refreshSurvey: () => Promise<void>
]

export const EcanvasserSurveyContext = createContext<EcanvasserSurveyContextValue>([{} as EcanvasserSurvey, async () => {}])

interface EcanvasserSurveyProviderProps {
  children: React.ReactNode
  survey: EcanvasserSurvey
}

export const EcanvasserSurveyProvider = ({ children, survey: initialSurvey }: EcanvasserSurveyProviderProps): React.JSX.Element => {
  const [survey, setSurvey] = useState<EcanvasserSurvey>(initialSurvey)

  const refreshSurvey = async () => {
    try {
      const resp = await clientFetch<EcanvasserSurvey>(apiRoutes.ecanvasser.surveys.find, {
        id: (survey as EcanvasserSurvey)?.id,
      })

      setSurvey(resp?.status === 404 ? { id: '' } : resp.data)
    } catch (e) {
      console.error('error fetching ecanvasser', e)
      setSurvey({ id: '' })
    }
  }

  return (
    <EcanvasserSurveyContext.Provider value={[survey, refreshSurvey]}>
      {children}
    </EcanvasserSurveyContext.Provider>
  )
}

