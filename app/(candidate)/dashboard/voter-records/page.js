import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import VoterRecordsPage from './components/VoterRecordsPage'
import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import { fetchCanDownload } from './utils'

const meta = pageMetaData({
  title: 'Voter Data | GoodParty.org',
  description: 'Voter Data',
  slug: '/dashboard/voter-records',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await candidateAccess()

  const user = await getServerUser() // can be removed when door knocking app is not for admins only
  const campaign = await fetchUserCampaign()
  if (!campaign?.isPro) {
    return redirect('/dashboard/upgrade-to-pro', 'replace')
  }
  const canDownload = await fetchCanDownload()

  const childProps = {
    pathname: '/dashboard/voter-records',
    user,
    campaign,
    canDownload,
  }

  return <VoterRecordsPage {...childProps} />
}
