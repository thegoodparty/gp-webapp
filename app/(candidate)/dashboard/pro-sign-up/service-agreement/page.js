import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { ServiceAgreementPage } from 'app/(candidate)/dashboard/pro-sign-up/service-agreement/components/ServiceAgreementPage'
import { restrictDemoAccess } from 'app/(candidate)/dashboard/shared/restrictDemoAccess'

const meta = pageMetaData({
  title: 'Pro Sign Up - Service Agreement | GoodParty.org',
  description: 'Pro Sign Up - Service Agreement',
  slug: '/dashboard/pro-sign-up/service-agreement',
})
export const metadata = meta

const Page = async ({ params }) => {
  await candidateAccess()
  restrictDemoAccess()

  const campaign = await fetchUserCampaign()

  const childProps = {
    campaign,
  }

  return <ServiceAgreementPage {...childProps} />
}

export default Page
