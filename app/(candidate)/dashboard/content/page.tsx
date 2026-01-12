import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import ContentPage from './components/ContentPage'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

export const dynamic = 'force-dynamic'

const meta = pageMetaData({
  title: 'Campaign Content | GoodParty.org',
  description: 'Campaign Content',
  slug: '/dashboard/content',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const campaign = await fetchUserCampaign()

  if (!campaign) {
    throw new Error('Campaign not found')
  }

  const childProps = {
    pathname: '/dashboard/content',
    campaign,
  }

  return (
    <>
      <HubSpotChatWidgetScript />
      <ContentPage {...childProps} />
    </>
  )
}
