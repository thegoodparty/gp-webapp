import pageMetaData from 'helpers/metadataHelper'
import DoorKnockingSurveysPage from './components/DoorKnockingSurveysPage'
import candidateAccess from '../../shared/candidateAccess'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { EcanvasserSurvey } from '@shared/hooks/EcanvasserSurveyProvider'

export const dynamic = 'force-dynamic'

const fetchSurveys = async (): Promise<EcanvasserSurvey[] | false> => {
  try {
    const resp = await serverFetch<EcanvasserSurvey[]>(
      apiRoutes.ecanvasser.surveys.list,
    )
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}

const meta = pageMetaData({
  title: 'Door Knocking Surveys | GoodParty.org',
  description: 'Door Knocking Surveys',
  slug: '/dashboard/door-knocking/surveys',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const surveys = await fetchSurveys()
  const childProps = {
    surveys: surveys || undefined,
    pathname: '/dashboard/door-knocking/surveys',
    title: 'Door Knocking Surveys',
  }

  return <DoorKnockingSurveysPage {...childProps} />
}
