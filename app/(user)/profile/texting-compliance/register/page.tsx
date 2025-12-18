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
  const campaign = await fetchUserCampaign()
  
  if (!campaign || !campaign.isPro) {
    redirect('/dashboard/upgrade-to-pro')
  }
  
  const [user, website] = await Promise.all([
    getServerUser(),
    fetchUserWebsite(),
  ])

  // Redirect if user doesn't have a purchased domain
  if (!website?.domain?.name) {
    redirect('/dashboard/website/domain')
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


