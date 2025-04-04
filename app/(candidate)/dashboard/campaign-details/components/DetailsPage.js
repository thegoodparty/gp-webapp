import DashboardLayout from '../../shared/DashboardLayout'
import CampaignSection from './CampaignSection'
import FunFactSection from './FunFactSection'
import IssuesSection from './IssuesSection'
import OfficeSection from './OfficeSection'
import RunningAgainstSection from './RunningAgainstSection'
import WhySection from './WhySection'
import { CandidatePositionsProvider } from 'app/(candidate)/dashboard/campaign-details/components/issues/CandidatePositionsProvider'

export default function DetailsPage(props) {
  return (
    <DashboardLayout {...props}>
      <CandidatePositionsProvider candidatePositions={props.candidatePositions}>
        <div className="max-w-[940px] mx-auto bg-gray-50 rounded-xl px-6 py-5">
          <CampaignSection {...props} />
          <OfficeSection {...props} />
          <RunningAgainstSection {...props} />
          <WhySection {...props} />
          <FunFactSection {...props} />
          <IssuesSection {...props} />
        </div>
      </CandidatePositionsProvider>
    </DashboardLayout>
  )
}
