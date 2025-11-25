import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import { getServerUser } from 'helpers/userServerHelper'
import ProSignUpPage from 'app/(candidate)/dashboard/pro-sign-up/components/ProSignUpPage'
import { restrictDemoAccess } from 'app/(candidate)/dashboard/shared/restrictDemoAccess'

const meta = pageMetaData({
  title: 'Pro Sign Up | GoodParty.org',
  description: 'Pro Sign Up',
  slug: '/dashboard/pro-sign-up',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  await restrictDemoAccess()

  const campaign = await fetchUserCampaign()
  const user = await getServerUser()

  const childProps = {
    campaign,
    user,
  }

  return <ProSignUpPage {...childProps} />
}
