import ConfidenceAlert from '../../shared/ConfidenceAlert'
import PollsIssues from './PollsIssues'
import DownloadResults from './DownloadResults'

export default function CompletedPoll(): React.JSX.Element {
  return (
    <div>
      <ConfidenceAlert />
      <div className="md:hidden my-4">
        <DownloadResults />
      </div>
      <PollsIssues />
    </div>
  )
}
