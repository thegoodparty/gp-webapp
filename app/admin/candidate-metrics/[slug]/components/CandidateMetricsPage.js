import CandidateAvatar from '@shared/candidates/CandidateAvatar'
import H3 from '@shared/typography/H3'
import UpdateHistorySection from 'app/(candidate)/dashboard/components/UpdateHistorySection'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import UpdateHistoryChart from './UpdateHistoryChart'
import TrackerStats from './TrackerStats'
import H1 from '@shared/typography/H1'
import AiContentTotals from './AiContentTotals'

export default function CandidateMetricsPage(props) {
  const { campaign, updateHistory } = props
  if (!campaign) {
    return null
  }

  const { firstName, lastName } = campaign.details || {}
  const { image } = campaign

  return (
    <AdminWrapper {...props}>
      <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 rounded-xl p-6 relative mt-8 pt-24">
        <div className="absolute left-1/2 -top-24 -ml-24">
          <CandidateAvatar candidate={{ firstName, lastName, image }} />
        </div>
        <H1 className="text-center mb-12">
          {firstName} {lastName}
        </H1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <H3 className="mb-6">Tracker Input frequency</H3>
              <UpdateHistoryChart {...props} />
              <UpdateHistorySection updateHistory={updateHistory} />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <H3 className="mb-6">Tracker Stats</H3>
              <TrackerStats {...props} />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <H3 className="mb-6">AI Content</H3>
              <AiContentTotals {...props} />
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  )
}
