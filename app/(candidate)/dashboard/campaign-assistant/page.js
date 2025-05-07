import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import CampaignAssistantPage from './components/CampaignAssistantPage'
import { getServerUser } from 'helpers/userServerHelper'
import candidateAccess from '../shared/candidateAccess'

const meta = pageMetaData({
  title: 'AI Assistant | GoodParty.org',
  description: 'AI Assistant',
  slug: '/dashboard/campaign-assistant',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await candidateAccess()

  const user = await getServerUser() // can be removed when door knocking app is not for admins only
  const campaign = await fetchUserCampaign()

  const childProps = {
    pathname: '/dashboard/campaign-assistant',
    user,
    campaign,
  }
  return <CampaignAssistantPage {...childProps} />
}
