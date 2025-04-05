'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const EcanvasserSurveyContext = createContext([{}, () => {}])

export function EcanvasserSurveyProvider({ children, survey: initialSurvey }) {
  const [survey, setSurvey] = useState(initialSurvey)

  const refreshSurvey = async () => {
    try {
      const resp = await clientFetch(apiRoutes.ecanvasser.surveys.find, {
        id: survey?.id,
      })

      setSurvey(resp?.status === 404 ? {} : resp.data)
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
