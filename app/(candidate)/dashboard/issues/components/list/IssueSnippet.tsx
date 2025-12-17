import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
import { dateUsHelper } from 'helpers/dateHelper'
import StatusPill, { IssueStatus } from '../../shared/StatusPill'

interface CommunityIssue {
  uuid: string
  createdAt: Date | string
  updatedAt: Date | string
  title: string
  description: string
  status: IssueStatus
  channel: string
  attachments: string[]
  campaignId: number
}

interface IssueSnippetProps {
  issue: CommunityIssue
}

export default function IssueSnippet({ issue }: IssueSnippetProps): React.JSX.Element {
  const { uuid, title, description, updatedAt, status } = issue
  return (
    <Paper className="">
      <H3>{title}</H3>
      <Body1 className="text-slate-600 mt-1 line-clamp-2">{description}</Body1>
      <Body2 className="text-slate-500 mt-4">
        Updated: {dateUsHelper(updatedAt)}
      </Body2>
      <div className="flex items-center mt-8">
        <StatusPill status={status} />
      </div>
      <Button
        className="mt-8 w-full"
        color="neutral"
        variant="outlined"
        href={`/dashboard/issues/${uuid}`}
      >
        View Details
      </Button>
    </Paper>
  )
}


