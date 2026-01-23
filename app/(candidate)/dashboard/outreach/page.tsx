import pageMetaData from 'helpers/metadataHelper'
import { OutreachPage } from './components/OutreachPage'
import candidateAccess from '../shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { NUM_OF_MOCK_OUTREACHES } from 'app/(candidate)/dashboard/outreach/constants'
import { createOutreach } from 'app/(candidate)/dashboard/outreach/util/createOutreach.util'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import { Outreach } from './hooks/OutreachContext'
import { TcrCompliance } from 'helpers/types'

const fetchOutreaches = async (): Promise<Outreach[]> => {
  const response = await serverFetch<Outreach[]>(apiRoutes.outreach.list)
  if (!response.ok) {
    if (response.status === 404) {
      return []
    }
    throw new Error('Failed to fetch outreach data')
  }
  return response.data || []
}

const meta = pageMetaData({
  title: 'Outreach | GoodParty.org',
  description: 'Manage your campaign outreach activities.',
  slug: '/dashboard/outreach',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const campaign = await fetchUserCampaign()

  if (!campaign) {
    redirect('/run-for-office')
  }

  const [outreaches, tcrComplianceResponse] = await Promise.all([
    fetchOutreaches(),
    serverFetch<TcrCompliance>(apiRoutes.campaign.tcrCompliance.fetch),
  ])

  const tcrCompliance: TcrCompliance | undefined = tcrComplianceResponse.ok
    ? tcrComplianceResponse.data
    : undefined

  const mockOutreaches = Array.from({ length: NUM_OF_MOCK_OUTREACHES }, () =>
    createOutreach(campaign.id),
  )

  return (
    <OutreachPage
      {...{
        pathname: '/dashboard/outreach',
        campaign,
        outreaches,
        mockOutreaches,
        tcrCompliance,
      }}
    />
  )
}
