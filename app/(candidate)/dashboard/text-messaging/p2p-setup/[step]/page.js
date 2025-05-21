import pageMetaData from 'helpers/metadataHelper'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import P2pSetupPage from './components/P2pSetupPage'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { getServerUser } from 'helpers/userServerHelper'

export const dynamic = 'force-dynamic'

export const metadata = pageMetaData({
  title: 'P2P Setup  | GoodParty.org',
  description: 'P2P Setup',
  slug: '/dashboard/text-messaging/p2p-setup/[step]',
})

export default async function Page({ params: { step } }) {
  await adminAccessOnly()

  const campaign = await fetchUserCampaign()
  const user = await getServerUser()

  return <P2pSetupPage step={step} user={user} campaign={campaign} />
}
