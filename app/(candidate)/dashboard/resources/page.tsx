import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import ResourcesPage from './components/ResourcesPage'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'

export const dynamic = 'force-dynamic'

const meta = pageMetaData({
  title: 'Resources | GoodParty.org',
  description: 'Free campaign resources to help you win your election',
  slug: '/dashboard/resources',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const campaign = await fetchUserCampaign()

  if (!campaign) {
    throw new Error('Campaign not found')
  }

  const childProps = {
    pathname: '/dashboard/resources',
    campaign,
  }

  return <ResourcesPage {...childProps} />
}
