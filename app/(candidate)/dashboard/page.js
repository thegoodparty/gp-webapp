import pageMetaData from 'helpers/metadataHelper'
import DashboardPage from './components/DashboardPage'
import candidateAccess from './shared/candidateAccess'
import { fetchUserCampaign } from '../onboarding/shared/getCampaign'

const meta = pageMetaData({
  title: 'Campaign Dashboard | GoodParty.org',
  description: 'Campaign Dashboard',
  slug: '/dashboard',
})
export const metadata = meta

export default async function Page() {
  await candidateAccess()
  const campaign = await fetchUserCampaign()
  const childProps = {
    pathname: '/dashboard',
    campaign,
  }
  return <DashboardPage {...childProps} />
}
