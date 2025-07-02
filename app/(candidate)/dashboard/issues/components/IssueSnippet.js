import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import H3 from '@shared/typography/H3'
import Paper from '@shared/utils/Paper'
import { dateUsHelper } from 'helpers/dateHelper'

const statusToText = {
  newIssue: 'New Issue',
  accepted: 'Accepted',
  inProgress: 'In Progress',
  wontDo: "Won't Do",
  completed: 'Completed',
}

const statusToColor = {
  newIssue: 'bg-slate-100',
  accepted: 'bg-green-100',
  inProgress: 'bg-yellow-100',
  wontDo: 'bg-red-100',
  completed: 'bg-green-100',
}

export default function IssueSnippet({ issue }) {
  const { id, title, description, updatedAt, status } = issue
  return (
    <Paper className="">
      <H3>{title}</H3>
      <Body1 className="text-slate-600 mt-1">{description}</Body1>
      <Body2 className="text-slate-500 mt-4">
        Updated: {dateUsHelper(updatedAt)}
      </Body2>
      <div className="flex items-center mt-8">
        <div
          className={`rounded-full py-1 px-3 border border-slate-200 inline-block text-xs font-medium ${statusToColor[status]}`}
        >
          {statusToText[status]}
        </div>
      </div>
      <Button className="mt-8 w-full" color="neutral" variant="outlined">
        View Details
      </Button>
    </Paper>
  )
}
