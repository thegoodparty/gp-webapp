import ProgressTimeline from './ProgressTimeline'
import IssueDetailsHeader from './IssueDetailsHeader'
import IssueDescription from './IssueDescription'

interface IssueDetailsPageProps {
  issue: Record<string, string | number | boolean | object | null>
  statusHistory: Record<string, string | number | boolean | object | null>[]
}

export default function IssueDetailsPage({
  issue,
  statusHistory,
}: IssueDetailsPageProps): React.JSX.Element {
  return (
    <div className="bg-indigo-100 p-2 md:p-4 min-h-[calc(100vh-56px)]">
      <div className="max-w-4xl mx-auto mt-4">
        <IssueDetailsHeader
          issue={
            issue as {
              title: string
              status: string
              createdAt: string
            }
          }
        />

        <div className="grid grid-cols-12 gap-4 mt-8">
          <IssueDescription issue={issue as { description: string }} />
          <ProgressTimeline
            issue={
              issue as {
                createdAt: string
              }
            }
            statusHistory={statusHistory as []}
          />
        </div>
      </div>
    </div>
  )
}
