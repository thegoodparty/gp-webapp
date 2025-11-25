import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import { getServerUser } from 'helpers/userServerHelper'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import CommitteeCheckPage from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/CommitteeCheckPage'
import { restrictDemoAccess } from 'app/(candidate)/dashboard/shared/restrictDemoAccess'

const meta = pageMetaData({
  title: 'Pro Sign Up - Committee Check | GoodParty.org',
  description: 'Pro Sign Up - Committee Check',
  slug: '/dashboard/pro-sign-up/committee-check',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

interface CommitteeCheckCampaign {
  details: {
    [key: string]: string | number | boolean | null | undefined
  }
}

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  await restrictDemoAccess()

  const fetchedCampaign = await fetchUserCampaign()
  const campaign = fetchedCampaign === false ? undefined : fetchedCampaign as CommitteeCheckCampaign | undefined
  const user = await getServerUser()

  const childProps = {
    campaign,
    user,
  }

  return <CommitteeCheckPage {...childProps} />
}
