import { adminAccessOnly } from 'helpers/permissionHelper'
import pageMetaData from 'helpers/metadataHelper'
import ProNoVoterPage from './components/ProNoVoterPage'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { Campaign } from 'helpers/types'

interface CampaignsResponse {
  campaigns: Campaign[]
}

const fetchCampaignsNoVoter = async (): Promise<CampaignsResponse> => {
  try {
    const resp = await serverFetch<CampaignsResponse>(
      apiRoutes.admin.campaign.proNoVoterFile,
      undefined,
      {
        revalidate: 10,
      },
    )
    return resp.data
  } catch (e) {
    return { campaigns: [] }
  }
}

const meta = pageMetaData({
  title: 'Pro users without voter file | GoodParty.org',
  description: 'Pro users without voter file',
  slug: '/admin/pro-no-voter-file',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page(): Promise<React.JSX.Element> {
  await adminAccessOnly()

  const { campaigns } = await fetchCampaignsNoVoter()
  return (
    <ProNoVoterPage
      pathname="/admin/pro-no-voter-file"
      title="Pro Users without L2 Data"
      campaigns={campaigns}
    />
  )
}
