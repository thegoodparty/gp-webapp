import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import ProfilePage from './components/ProfilePage'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { DOMAIN_STATUS } from 'app/(candidate)/dashboard/website/util/domain.util'

const meta = pageMetaData({
  title: 'Profile Settings',
  description: 'Profile settings for GoodParty.org.',
})
export const metadata = meta

export default async function Page() {
  const user = await getServerUser()
  if (!user) {
    redirect('/login')
  }
  const campaign = await fetchUserCampaign()
  const { subscriptionCancelAt } = campaign?.details || {}

  const [websiteResponse, domainStatusResponse, tcrComplianceResponse] =
    await Promise.all([
      serverFetch(apiRoutes.website.get),
      serverFetch(apiRoutes.domain.status),
      serverFetch(apiRoutes.campaign.tcrCompliance.fetch),
    ])

  const website = websiteResponse.ok ? websiteResponse.data : null
  const domainStatus = domainStatusResponse.ok
    ? domainStatusResponse.data
    : null
  const tcrCompliance = tcrComplianceResponse.ok
    ? tcrComplianceResponse.data
    : null

  console.log(`website =>`, website)
  console.log(`domainStatus =>`, domainStatus)
  console.log(`tcrCompliance =>`, tcrCompliance)

  const childProps = {
    user,
    isPro: campaign?.isPro,
    subscriptionCancelAt,
    website,
    domainStatus: { message: DOMAIN_STATUS.SUCCESSFUL },
    tcrCompliance: { status: 'pending' },
  }

  return <ProfilePage {...childProps} />
}
