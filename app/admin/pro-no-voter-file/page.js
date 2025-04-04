import { adminAccessOnly } from 'helpers/permissionHelper'
import pageMetaData from 'helpers/metadataHelper'
import ProNoVoterPage from './components/ProNoVoterPage'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

async function fetchCampaignsNoVoter() {
  try {
    const resp = await serverFetch(
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

export default async function Page() {
  await adminAccessOnly()

  const campaigns = await fetchCampaignsNoVoter()
  const childProps = { campaigns }
  return <ProNoVoterPage {...childProps} />
}
