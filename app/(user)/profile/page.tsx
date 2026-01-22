import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import ProfilePage from './components/ProfilePage'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { fetchUserWebsite } from 'helpers/fetchUserWebsite'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import type { TcrCompliance } from 'helpers/types'
import type { ComponentProps } from 'react'

const meta = pageMetaData({
  title: 'Profile Settings',
  description: 'Profile settings for GoodParty.org.',
})
export const metadata = meta

type ProfilePageProps = ComponentProps<typeof ProfilePage>

const Page = async (): Promise<React.JSX.Element> => {
  const user = await getServerUser()
  if (!user) {
    redirect('/login')
  }
  const campaign = await fetchUserCampaign()
  const { subscriptionCancelAt } = campaign?.details || {}

  const [website, domainStatusResponse, tcrComplianceResponse] =
    await Promise.all([
      fetchUserWebsite(),
      serverFetch<string>(apiRoutes.domain.status),
      serverFetch<TcrCompliance>(apiRoutes.campaign.tcrCompliance.fetch),
    ])

  const domainStatus = domainStatusResponse.ok
    ? domainStatusResponse.data
    : null
  const tcrCompliance = tcrComplianceResponse.ok
    ? tcrComplianceResponse.data
    : null

  const childProps: ProfilePageProps = {
    user,
    isPro: Boolean(campaign?.isPro),
    subscriptionCancelAt,
    website,
    domainStatus,
    tcrCompliance,
  }

  return <ProfilePage {...childProps} />
}

export default Page
