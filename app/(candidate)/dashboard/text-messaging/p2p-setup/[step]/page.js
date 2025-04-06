import pageMetaData from 'helpers/metadataHelper'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import P2pSetupPage from './components/P2pSetupPage'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'

async function fetchTextMessaging() {
  const resp = await serverFetch(apiRoutes.textMessaging.list)
  return resp.data
}

const meta = pageMetaData({
  title: 'P2P Setup  | GoodParty.org',
  description: 'P2P Setup',
  slug: '/dashboard/text-messaging/p2p-setup/[step]',
})
export const metadata = meta

export default async function Page({ params, searchParams }) {
  await adminAccessOnly()

  const { step } = params

  const [campaign] = await Promise.all([fetchUserCampaign()])

  const childProps = {
    pathname: `/dashboard/text-messaging/p2p-setup/${step}`,
    campaign,
    step,
  }

  return <P2pSetupPage {...childProps} />
}
