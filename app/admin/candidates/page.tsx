import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminCandidatesPage from './components/AdminCandidatesPage'
import pageMetaData from 'helpers/metadataHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { Campaign } from 'helpers/types'

const meta = pageMetaData({
  title: 'Admin Candidates | GoodParty.org',
  description: 'Admin Candidates Dashboard.',
  slug: '/admin/candidates',
})
export const metadata = meta

export const maxDuration = 60

const fetchCampaigns = async (): Promise<Campaign[]> => {
  const resp = await serverFetch<Campaign[]>(apiRoutes.campaign.list)
  return resp.data
}

export default async function Page(): Promise<React.JSX.Element> {
  await adminAccessOnly()
  const campaigns = await fetchCampaigns()

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Candidate List',
    campaigns,
  }
  return <AdminCandidatesPage {...childProps} />
}
