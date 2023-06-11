import InfoButton from '@shared/buttons/InfoButton';
import IssuesList from './IssuesList';

export default function OverviewTab(props) {
  const { changeTabCallback } = props;
  return (
    <div>
      <IssuesList {...props} previewMode />
      <div
        className="text-center mt-7"
        onClick={() => {
          changeTabCallback(1);
        }}
      >
        <InfoButton variant="text">See all issues</InfoButton>
      </div>
    </div>
  );
}
