import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import DoorKnockingPage from './components/DoorKnockingPage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'

async function fetchEcanvasserSummary() {
  const response = await serverFetch(apiRoutes.ecanvasser.mySummary)
  return response.data
}

const meta = pageMetaData({
  title: 'Door Knocking | GoodParty.org',
  description: 'Door Knocking',
  slug: '/dashboard/door-knocking',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await candidateAccess()

  const [campaign, summary] = await Promise.all([
    fetchUserCampaign(),
    fetchEcanvasserSummary(),
  ])

  const childProps = {
    pathname: '/dashboard/door-knocking',
    campaign,
    summary,
  }

  return <DoorKnockingPage {...childProps} />
}
