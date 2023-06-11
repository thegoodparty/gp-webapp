import InfoButton from '@shared/buttons/InfoButton';
import IssuesList from './IssuesList';

export default function IssuesTab(props) {
  return (
    <div>
      <IssuesList {...props} />
    </div>
  );
}
