'use client'

import DashboardLayout from '../../shared/DashboardLayout'
import CampaignSection from './CampaignSection'
import FunFactSection from './FunFactSection'
import IssuesSection from './IssuesSection'
import OfficeSection from './OfficeSection'
import RunningAgainstSection from './RunningAgainstSection'
import WhySection from './WhySection'
import { CandidatePositionsProvider } from 'app/dashboard/campaign-details/components/issues/CandidatePositionsProvider'
import { useCampaign } from '@shared/hooks/useCampaign'
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
  campaign: Campaign | undefined
  candidatePositions: CandidatePosition[]
  topIssues: TopIssue[]
  pathToVictory?: PathToVictoryData
  user?: User | null
}

export default function DetailsPage(
  props: DetailsPageProps,
): React.JSX.Element {
  const [campaign] = useCampaign()
  const campaignProps = { ...props, campaign: campaign ?? undefined }

  return (
    <DashboardLayout {...props}>
      <CandidatePositionsProvider candidatePositions={props.candidatePositions}>
        <div className="max-w-[940px] mx-auto bg-gray-50 rounded-xl px-6 py-5">
          {campaign && <CampaignSection {...campaignProps} />}
          <OfficeSection campaign={campaign ?? undefined} />
          {campaign && <RunningAgainstSection {...campaignProps} />}
          {campaign && <WhySection {...campaignProps} />}
          {campaign && <FunFactSection {...campaignProps} />}
          {campaign && <IssuesSection {...campaignProps} />}
        </div>
      </CandidatePositionsProvider>
    </DashboardLayout>
  )
}
