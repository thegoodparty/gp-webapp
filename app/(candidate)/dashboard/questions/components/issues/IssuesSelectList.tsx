import { IssueSelectItem } from './IssueSelectItem'

interface IssueForSelect {
  id?: string | number
  name?: string
  positions?: string[]
}

interface IssuesSelectListProps {
  issues?: IssueForSelect[]
  handleSelectIssue?: (issue: IssueForSelect) => void
}

export const IssuesSelectList = ({ issues = [], handleSelectIssue = () => {} }: IssuesSelectListProps): React.JSX.Element[] =>
  issues.map((issue) => (
    <IssueSelectItem
      key={issue.id}
      issue={issue}
      handleSelectIssue={handleSelectIssue}
    />
  ))

