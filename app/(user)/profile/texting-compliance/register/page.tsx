import pageMetaData from 'helpers/metadataHelper'
import TextingComplianceRegisterPage from './components/TextingComplianceRegisterPage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { getServerUser } from 'helpers/userServerHelper'
import { fetchUserWebsite } from 'helpers/fetchUserWebsite'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const meta = pageMetaData({
  title: 'Register - Texting Compliance | GoodParty.org',
  description: 'Register for texting compliance.',
})
export const metadata = meta

const Page = async (): Promise<React.JSX.Element> => {
  await candidateAccess()
  const user = await getServerUser()
  
  // Parallelize campaign and website fetches since they don't depend on each other
  const [campaign, website] = await Promise.all([
    fetchUserCampaign(),
    fetchUserWebsite(),
  ])

  if (!campaign?.isPro) {
    return redirect('/dashboard/upgrade-to-pro', 'replace')
  }

  return (
    <TextingComplianceRegisterPage
      {...{
        user,
        campaign,
        website,
      }}
    />
  )
}

export default Page


