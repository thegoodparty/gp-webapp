import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import DetailsPage from './components/DetailsPage'
import { getServerUser } from 'helpers/userServerHelper'
import {
  serverFetchIssues,
  serverLoadCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

const meta = pageMetaData({
  title: 'campaign Details | GoodParty.org',
  description: 'Campaign Details',
  slug: '/dashboard/campaign-details',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const campaign = await fetchUserCampaign()
  if (!campaign) {
    throw new Error('Campaign not found')
  }
  let candidatePositions = await serverLoadCandidatePosition(campaign.id)
  const topIssues = await serverFetchIssues()
  const user = await getServerUser() // can be removed when door knocking app is not for admins only
  if (!candidatePositions) {
    candidatePositions = []
  }

  const childProps = {
    pathname: '/dashboard/campaign-details',
    campaign,
    candidatePositions,
    topIssues,
    pathToVictory: campaign?.pathToVictory?.data,
    user,
  }

  return (
    <>
      <HubSpotChatWidgetScript />
      <DetailsPage {...childProps} />
    </>
  )
}
