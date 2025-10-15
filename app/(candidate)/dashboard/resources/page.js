import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import ResourcesPage from './components/ResourcesPage'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { getServerUser } from 'helpers/userServerHelper'

export const dynamic = 'force-dynamic'

const meta = pageMetaData({
  title: 'Resources | GoodParty.org',
  description: 'Free campaign resources to help you win your election',
  slug: '/dashboard/resources',
})
export const metadata = meta

export default async function Page() {
  await candidateAccess()
  const campaign = await fetchUserCampaign()
  const user = await getServerUser()

  const childProps = {
    pathname: '/dashboard/resources',
    campaign,
    user,
  }

  return <ResourcesPage {...childProps} />
}

