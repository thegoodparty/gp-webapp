import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import { getServerUser } from 'helpers/userServerHelper'
import UpgradeToProPage from './components/UpdateToProPage'
import { serverLoadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils'
const meta = pageMetaData({
  title: 'Upgrade To Pro! | GoodParty.org',
  description: 'Upgrade To Pro!',
  slug: '/dashboard/upgrade-to-pro',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await candidateAccess()

  const campaign = await fetchUserCampaign()
  const candidatePositions = await serverLoadCandidatePosition(campaign.id)
  const user = await getServerUser()

  const childProps = {
    pathname: '/dashboard/upgrade-to-pro',
    campaign,
    candidateSlug: campaign?.slug,
    candidatePositions,
    user,
  }
  return <UpgradeToProPage {...childProps} />
}
