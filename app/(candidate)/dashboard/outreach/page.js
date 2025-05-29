import pageMetaData from 'helpers/metadataHelper'
import OutreachPage from './components/OutreachPage'
import candidateAccess from '../shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'

const meta = pageMetaData({
  title: 'Outreach | GoodParty.org',
  description: 'Manage your campaign outreach activities.',
  slug: '/dashboard/outreach',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page() {
  await candidateAccess()
  const campaign = await fetchUserCampaign()
  return <OutreachPage {...{campaign}} />
} 