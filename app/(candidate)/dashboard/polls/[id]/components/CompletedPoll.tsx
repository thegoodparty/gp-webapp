import ConfidenceAlert from '../../shared/ConfidenceAlert'
import PollsIssues from './PollsIssues'

export default function CompletedPoll(): React.JSX.Element {
  return (
    <div>
      <ConfidenceAlert />
      <PollsIssues />
    </div>
  )
}
