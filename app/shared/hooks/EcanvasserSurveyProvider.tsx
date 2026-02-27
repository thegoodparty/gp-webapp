'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface AnswerType {
  name: string
}

interface Question {
  id: number | string
  name: string
  answer_type: AnswerType
  required: boolean
}

export interface EcanvasserSurvey {
  id: string
  name?: string
  description?: string
  status?: string
  requires_signature?: boolean
  questions?: Question[]
}

export type EcanvasserSurveyContextValue = [
  survey: EcanvasserSurvey,
  refreshSurvey: () => Promise<void>,
]

const defaultSurvey: EcanvasserSurvey = { id: '' }
export const EcanvasserSurveyContext =
  createContext<EcanvasserSurveyContextValue>([defaultSurvey, async () => {}])

interface EcanvasserSurveyProviderProps {
  children: React.ReactNode
  survey: EcanvasserSurvey
}

export const EcanvasserSurveyProvider = ({
  children,
  survey: initialSurvey,
}: EcanvasserSurveyProviderProps): React.JSX.Element => {
  const [survey, setSurvey] = useState<EcanvasserSurvey>(initialSurvey)

  const refreshSurvey = async () => {
    try {
      const resp = await clientFetch<EcanvasserSurvey>(
        apiRoutes.ecanvasser.surveys.find,
        {
          id: survey?.id,
        },
      )

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
