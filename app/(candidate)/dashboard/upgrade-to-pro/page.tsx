import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import UpgradeToProPage from './components/UpdateToProPage'
import { serverLoadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'
import { CandidatePosition } from 'helpers/types'

const meta = pageMetaData({
  title: 'Upgrade To Pro! | GoodParty.org',
  description: 'Upgrade To Pro!',
  slug: '/dashboard/upgrade-to-pro',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const campaign = await fetchUserCampaign()
  const candidatePositionsResult = campaign?.id
    ? await serverLoadCandidatePosition(campaign.id)
    : false
  const candidatePositions: CandidatePosition[] | undefined =
    candidatePositionsResult === false ? undefined : candidatePositionsResult

  const childProps = {
    pathname: '/dashboard/upgrade-to-pro',
    campaign,
    candidatePositions,
  }
  return (
    <>
      <HubSpotChatWidgetScript />
      <UpgradeToProPage {...childProps} />
    </>
  )
}
