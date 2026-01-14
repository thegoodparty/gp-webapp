import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import CampaignAssistantPage from './components/CampaignAssistantPage'
import candidateAccess from '../shared/candidateAccess'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

const meta = pageMetaData({
  title: 'AI Assistant | GoodParty.org',
  description: 'AI Assistant',
  slug: '/dashboard/campaign-assistant',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()

  const campaign = await fetchUserCampaign()

  if (!campaign) {
    throw new Error('Campaign not found')
  }

  const childProps = {
    pathname: '/dashboard/campaign-assistant',
    campaign,
  }
  return (
    <>
      <HubSpotChatWidgetScript />
      <CampaignAssistantPage {...childProps} />
    </>
  )
}
