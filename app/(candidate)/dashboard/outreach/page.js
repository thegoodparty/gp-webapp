import pageMetaData from 'helpers/metadataHelper'
import { OutreachPage } from './components/OutreachPage'
import candidateAccess from '../shared/candidateAccess'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { NUM_OF_MOCK_OUTREACHES } from './consts'
import { createOutreach } from 'app/(candidate)/dashboard/outreach/util/createOutreach.util'

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
  const outreaches = []
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
