import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import IssueDetailsPage from './components/IssueDetailsPage'
import { IssueStatus } from '../shared/StatusPill'

interface CommunityIssue {
  uuid: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  status: IssueStatus
  channel: string
  attachments: string[]
  campaignId: number
  location?: string
}

interface StatusHistoryItem {
  toStatus: IssueStatus | 'submitted'
  createdAt: string
}

interface Params {
  uuid: string
}

const fetchIssue = async (uuid: string): Promise<CommunityIssue> => {
  const resp = await serverFetch<CommunityIssue>(apiRoutes.issues.get, {
    uuid,
  })
  return resp.data
}

const fetchIssueChangelog = async (uuid: string): Promise<StatusHistoryItem[]> => {
  const resp = await serverFetch<StatusHistoryItem[]>(apiRoutes.issues.getStatusHistory, {
    uuid,
  })
  return resp.data
}

const meta = pageMetaData({
  title: 'Issue Details | GoodParty.org',
  description: 'View issue details',
  slug: '/dashboard/issues/[uuid]',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Params }): Promise<React.JSX.Element> {
  await adminAccessOnly()

  const { uuid } = params

  const [issue, statusHistory] = await Promise.all([
    fetchIssue(uuid),
    fetchIssueChangelog(uuid),
  ])

  return <IssueDetailsPage issue={issue} statusHistory={statusHistory} />
}
