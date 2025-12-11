import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { getServerToken } from 'helpers/userServerHelper'
import pageMetaData from 'helpers/metadataHelper'
import AdminAllCandidatesPage from './components/AdminAllCandidatesPage'

const meta = pageMetaData({
  title: 'All Candidates | GoodParty.org',
  description: 'Admin all Candidates',
  slug: '/admin/candidates',
})
export const metadata = meta
export const maxDuration = 60

const fetchCandidates = async () => {
  const api = gpApi.admin.candidates
  const token = await getServerToken()
  return await gpFetch(api, undefined, 0, token as string)
}

export default async function Page() {
  await adminAccessOnly()
  const { candidates } = (await fetchCandidates()) as { candidates: Record<string, string>[] }

  const childProps = {
    pathname: '/admin/candidates',
    title: 'All Candidate List',
    candidates,
  }
  return <AdminAllCandidatesPage {...childProps} />
}
