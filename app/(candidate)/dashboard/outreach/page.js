import pageMetaData from 'helpers/metadataHelper'
import { OutreachPage } from './components/OutreachPage'
import candidateAccess from '../shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { NUM_OF_MOCK_OUTREACHES } from 'app/(candidate)/dashboard/outreach/constants'
import { createOutreach } from 'app/(candidate)/dashboard/outreach/util/createOutreach.util'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'

const fetchOutreaches = async () => {
  const response = await serverFetch(apiRoutes.outreach.list)
  console.log(`response =>`, response)
  if (!response.ok) {
    if (response.status === 404) {
      return []
    }
    throw new Error('Failed to fetch outreach data')
  }
  return response.data
}

const meta = pageMetaData({
  title: 'Outreach | GoodParty.org',
  description: 'Manage your campaign outreach activities.',
  slug: '/dashboard/outreach',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

export default async function Page() {
  await candidateAccess()
  const campaign = await fetchUserCampaign()
  const outreaches = await fetchOutreaches()
  const mockOutreaches = Array.from({ length: NUM_OF_MOCK_OUTREACHES }, () =>
    createOutreach(campaign.id),
  )

  return (
    <OutreachPage
      {...{
        campaign,
        outreaches,
        mockOutreaches,
      }}
    />
  )
}
