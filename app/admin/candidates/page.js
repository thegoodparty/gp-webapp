import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminCandidatesPage from './components/AdminCandidatesPage'
import pageMetaData from 'helpers/metadataHelper'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

const meta = pageMetaData({
  title: 'Admin Candidates | GoodParty.org',
  description: 'Admin Candidates Dashboard.',
  slug: '/admin/candidates',
})
export const metadata = meta

export const maxDuration = 60
const fetchCampaigns = async () => {
  const resp = await serverFetch(apiRoutes.campaign.list)
  return resp.data
}

export default async function Page() {
  await adminAccessOnly()
  const campaigns = await fetchCampaigns()

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Candidate List',
    campaigns,
  }
  return <AdminCandidatesPage {...childProps} />
}
