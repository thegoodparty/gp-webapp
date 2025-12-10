import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import AddIssueButton from './AddIssueButton'

export default function IssuesHeader(): React.JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <div>
        <H1>Issue Management</H1>
        <Body1 className="text-slate-600 mt-1">
          Track and manage community issues
        </Body1>
      </div>
      <div>
        <AddIssueButton />
      </div>
    </div>
  )
}
