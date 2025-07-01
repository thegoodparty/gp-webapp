import pageMetaData from 'helpers/metadataHelper'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import IssuesPage from './components/IssuesPage'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'

async function fetchIssues() {
  const resp = await serverFetch(apiRoutes.issues.list)
  return resp.data
}

const meta = pageMetaData({
  title: 'Issues | GoodParty.org',
  description: 'Issues',
  slug: '/dashboard/issues',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params, searchParams }) {
  await adminAccessOnly()

  const [campaign] = await Promise.all([
    fetchUserCampaign(),
    // fetchIssues(),
  ])

  const issues = []

  return (
    <IssuesPage
      pathname="/dashboard/issues"
      campaign={campaign}
      issues={issues}
    />
  )
}
