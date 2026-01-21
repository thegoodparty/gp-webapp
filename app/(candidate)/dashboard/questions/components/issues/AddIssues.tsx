import Body1 from '@shared/typography/Body1'
import IssuesSelector from './IssuesSelector'
import type { Campaign, CandidatePosition, TopIssue } from 'helpers/types'
import type { EditIssuePosition } from './IssuesList'

interface AddIssuesProps {
  completeCallback?: (value: string) => void
  updatePositionsCallback?: (value: CandidatePosition[] | false) => Promise<void>
  campaign: Campaign
  editIssuePosition?: EditIssuePosition | false
  topIssues?: TopIssue[]
  candidatePositions?: CandidatePosition[] | false
}

export default function AddIssues(props: AddIssuesProps): React.JSX.Element {
  return (
    <div>
      <h1 className="text-[32px] mb-2 text-center">
        What are the top 3 issues you care about?
      </h1>
      <Body1 className="text-center mb-6">
        These will be the focus of your campaign and help you connect with
        voters. <br />
        Don&apos;t worry, you can always change these later.
      </Body1>
      <IssuesSelector {...props} />
    </div>
  )
}
