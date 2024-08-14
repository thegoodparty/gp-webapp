import DashboardLayout from '../../shared/DashboardLayout';
import CampaignSection from './CampaignSection';
import DetailsSection from './DetailsSection';
import FunFactSection from './FunFactSection';
import IssuesSection from './IssuesSection';
import OfficeSection from './OfficeSection';
import RunningAgainstSection from './RunningAgainstSection';
import WhySection from './WhySection';
import { CandidatePositionsProvider } from 'app/(candidate)/dashboard/details/components/issues/CandidatePositionsProvider';

export default function DetailsPage(props) {
  return (
    <DashboardLayout {...props}>
      <CandidatePositionsProvider candidatePositions={props.candidatePositions}>
        <div className="bg-gray-50 rounded-xl py-5">
          <DetailsSection {...props} />
          <CampaignSection {...props} />
          <OfficeSection {...props} />
          <RunningAgainstSection {...props} />
          <WhySection {...props} />
          <FunFactSection {...props} />
          <IssuesSection {...props} />
        </div>
      </CandidatePositionsProvider>
    </DashboardLayout>
  );
}
