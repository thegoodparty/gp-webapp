import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from 'app/dashboard/shared/candidateAccess'
import { fetchUserCampaign } from 'app/onboarding/shared/getCampaign'
import { ServiceAgreementPage } from 'app/dashboard/pro-sign-up/service-agreement/components/ServiceAgreementPage'

const meta = pageMetaData({
  title: 'Pro Sign Up - Service Agreement | GoodParty.org',
  description: 'Pro Sign Up - Service Agreement',
  slug: '/dashboard/pro-sign-up/service-agreement',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

const Page = async (): Promise<React.JSX.Element> => {
  await candidateAccess()

  const campaign = await fetchUserCampaign()

  const childProps = {
    campaign,
  }

  return <ServiceAgreementPage {...childProps} />
}

export default Page
