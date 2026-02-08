'use client'
import { useState } from 'react'
import SurveyCard from './SurveyCard'
import EmptyState from './EmptyState'
import CreateSurvey from './CreateSurvey'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { EcanvasserSurvey } from '@shared/hooks/EcanvasserSurveyProvider'

interface EcanvasserTeam {
  id: number
  name: string
}

interface SurveyListProps {
  surveys?: EcanvasserSurvey[]
  teams?: EcanvasserTeam[]
}

const fetchSurveys = async (): Promise<EcanvasserSurvey[]> => {
  const resp = await clientFetch<EcanvasserSurvey[]>(apiRoutes.ecanvasser.surveys.list)
  return resp.data
}

export default function SurveyList(props: SurveyListProps): React.JSX.Element {
  const [surveys, setSurveys] = useState(props.surveys)

  const refreshSurveys = async () => {
    const resp = await fetchSurveys()
    setSurveys(resp)
  }

  return !surveys || !Array.isArray(surveys) || surveys.length === 0 ? (
    <EmptyState teams={props.teams} createCallback={refreshSurveys} />
  ) : (
    <>
      <div className="flex justify-end">
        <CreateSurvey teams={props.teams} createCallback={refreshSurveys} />
      </div>
      <div className="grid grid-cols-12 gap-4 mt-8">
        {Array.isArray(surveys) &&
          surveys.map((survey) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4"
              key={survey.id}
            >
              <SurveyCard survey={survey} />
            </div>
          ))}
      </div>
    </>
  )
}
