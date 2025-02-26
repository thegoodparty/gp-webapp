import { IssueSelectItem } from './IssueSelectItem';

export const IssuesSelectList = ({
  issues = [],
  handleSelectIssue = () => {},
}) =>
  issues.map((issue) => (
    <IssueSelectItem
      key={issue.id}
      issue={issue}
      handleSelectIssue={handleSelectIssue}
    />
  ));
