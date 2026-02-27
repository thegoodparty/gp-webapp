import DashboardLayout from '../../shared/DashboardLayout'
import CampaignSection from './CampaignSection'
import FunFactSection from './FunFactSection'
import IssuesSection from './IssuesSection'
import OfficeSection from './OfficeSection'
import RunningAgainstSection from './RunningAgainstSection'
import WhySection from './WhySection'
import { CandidatePositionsProvider } from 'app/(candidate)/dashboard/campaign-details/components/issues/CandidatePositionsProvider'
import {
  Campaign,
  User,
  PathToVictoryData,
  CandidatePosition,
} from 'helpers/types'

interface TopIssue {
  id: number
  name: string
  positions?: { id: number; name: string }[]
}

interface DetailsPageProps {
  pathname: string
  campaign: Campaign
  candidatePositions: CandidatePosition[]
  topIssues: TopIssue[]
  pathToVictory?: PathToVictoryData
  user?: User | null
}

export default function DetailsPage(
  props: DetailsPageProps,
): React.JSX.Element {
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
