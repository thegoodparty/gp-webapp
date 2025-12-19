import CandidateAvatar from '@shared/candidates/CandidateAvatar'
import H3 from '@shared/typography/H3'
import UpdateHistorySection from 'app/(candidate)/dashboard/components/UpdateHistorySection'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import UpdateHistoryChart from './UpdateHistoryChart'
import TrackerStats from './TrackerStats'
import H1 from '@shared/typography/H1'
import AiContentTotals from './AiContentTotals'
import { Campaign, CampaignUpdateHistory } from 'helpers/types'

interface CandidateMetricsPageProps {
  pathname: string
  title: string
  campaign: Campaign
  updateHistory: CampaignUpdateHistory[]
}

export default function CandidateMetricsPage(
  props: CandidateMetricsPageProps,
): React.JSX.Element | null {
  const { campaign, updateHistory, pathname, title } = props
  if (!campaign) {
    return null
  }

  const { firstName, lastName, image } = campaign

  return (
    <AdminWrapper pathname={pathname} title={title}>
      <div
        className="
          bg-gradient-to-b
          from-blue-50
          via-blue-100
          to-blue-200
          rounded-xl
          p-6
          relative
          mt-8
          pt-24
        "
      >
        <div className="absolute left-1/2 -top-24 -ml-24">
          <CandidateAvatar
            candidate={{ firstName: firstName || '', lastName: lastName || '', image }}
          />
        </div>
        <H1 className="text-center mb-12">
          {firstName} {lastName}
        </H1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <H3 className="mb-6">Tracker Input frequency</H3>
              <UpdateHistoryChart updateHistory={updateHistory} />
              <UpdateHistorySection />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <H3 className="mb-6">Tracker Stats</H3>
              <TrackerStats campaign={campaign} />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <H3 className="mb-6">AI Content</H3>
              <AiContentTotals campaign={campaign} />
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  )
}
