import pageMetaData from 'helpers/metadataHelper'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import TextMessagingPage from './components/TextMessagingPage'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'

async function fetchTextMessaging() {
  const resp = await serverFetch(apiRoutes.textMessaging.list)
  return resp.data
}

const meta = pageMetaData({
  title: 'Text Messaging | GoodParty.org',
  description: 'Text Messaging',
  slug: '/dashboard/text-messaging',
})
export const metadata = meta

export default async function Page({ params, searchParams }) {
  await adminAccessOnly()

  const [campaign, textMessaging] = await Promise.all([
    fetchUserCampaign(),
    fetchTextMessaging(),
  ])

  const childProps = {
    pathname: '/dashboard/text-messaging',
    campaign,
    textMessaging,
    compliance: false,
  }

  return <TextMessagingPage {...childProps} />
}
