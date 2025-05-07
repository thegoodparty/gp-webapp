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

export const dynamic = 'force-dynamic'

export const metadata = pageMetaData({
  title: 'P2P Setup  | GoodParty.org',
  description: 'P2P Setup',
  slug: '/dashboard/text-messaging/p2p-setup/[step]',
})

export default async function Page({ params: { step } }) {
  await adminAccessOnly()

  const campaign = await fetchUserCampaign()

  return (
    <P2pSetupPage
      {...{
        pathname: `/dashboard/text-messaging/p2p-setup/${step}`,
        campaign,
        step,
      }}
    />
  )
}
