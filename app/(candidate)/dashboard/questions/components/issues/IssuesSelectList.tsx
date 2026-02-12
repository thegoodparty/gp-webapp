import { IssueSelectItem } from './IssueSelectItem'

import type { IssuePosition } from 'helpers/types'

interface IssueForSelect {
  id?: number
  name?: string
  positions?: IssuePosition[]
}

interface IssuesSelectListProps {
  issues?: IssueForSelect[]
  handleSelectIssue?: (issue: IssueForSelect) => void
}

export const IssuesSelectList = ({
  issues = [],
  handleSelectIssue = () => {},
}: IssuesSelectListProps): React.JSX.Element[] =>
  issues.map((issue) => (
    <IssueSelectItem
      key={issue.id}
      issue={issue}
      handleSelectIssue={handleSelectIssue}
    />
  ))
