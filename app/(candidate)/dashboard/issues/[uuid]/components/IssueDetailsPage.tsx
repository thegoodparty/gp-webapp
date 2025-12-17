import ProgressTimeline from './ProgressTimeline'
import IssueDetailsHeader from './IssueDetailsHeader'
import IssueDescription from './IssueDescription'
import { IssueStatus } from '../../shared/StatusPill'

interface StatusHistoryItem {
  toStatus: IssueStatus | 'submitted'
  createdAt: string
}

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

interface IssueDetailsPageProps {
  issue: CommunityIssue
  statusHistory: StatusHistoryItem[]
}

export default function IssueDetailsPage({
  issue,
  statusHistory,
}: IssueDetailsPageProps): React.JSX.Element {
  return (
    <div className="bg-indigo-100 p-2 md:p-4 min-h-[calc(100vh-56px)]">
      <div className="max-w-4xl mx-auto mt-4">
        <IssueDetailsHeader issue={issue} />

        <div className="grid grid-cols-12 gap-4 mt-8">
          <IssueDescription issue={issue} />
          <ProgressTimeline issue={issue} statusHistory={statusHistory} />
        </div>
      </div>
    </div>
  )
}
