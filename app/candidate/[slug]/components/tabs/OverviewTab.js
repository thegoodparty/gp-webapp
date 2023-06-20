import InfoButton from '@shared/buttons/InfoButton';
import GetMeTrending from '../GetMeTrending';
import IssuesList from '../IssuesList';
import InfoTab from './InfoTab';
import { TABS_ENUM } from './TabsSection';

export default function OverviewTab(props) {
  const { changeTabCallback } = props;
  return (
    <div>
      <IssuesList {...props} previewMode />
      <div
        className="text-center mt-7 mb-12"
        onClick={() => {
          changeTabCallback(TABS_ENUM.issues);
        }}
      >
        <InfoButton variant="text">See all issues</InfoButton>
      </div>
      <GetMeTrending {...props} />
      <div className="mt-16">
        <InfoTab {...props} previewMode />
      </div>
    </div>
  );
}
