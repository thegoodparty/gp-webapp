import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import IssueDetailsPage from './components/IssueDetailsPage'

async function fetchIssue(uuid) {
  const resp = await serverFetch(apiRoutes.issues.get, {
    uuid,
  })
  return resp.data
}

async function fetchIssueChangelog(uuid) {
  const resp = await serverFetch(apiRoutes.issues.getStatusHistory, {
    uuid,
  })
  return resp.data
}

const meta = pageMetaData({
  title: 'Add Issue | GoodParty.org',
  description: 'Add Issue',
  slug: '/dashboard/issues/add-issue',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params }) {
  await adminAccessOnly()

  const { uuid } = params

  const [issue, statusHistory] = await Promise.all([
    fetchIssue(uuid),
    fetchIssueChangelog(uuid),
  ])

  return <IssueDetailsPage issue={issue} statusHistory={statusHistory} />
}
