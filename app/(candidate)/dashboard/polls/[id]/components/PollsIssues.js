'use client'
import { pollIssues } from '../../tempData'
import H2 from '@shared/typography/H2'
import { usePoll } from '../hooks/PollProvider'
import PollsIssueCard from './PollsIssueCard'

export default function PollsIssues() {
  const [poll] = usePoll()
  const issues = pollIssues || []
  if (issues.length === 0) {
    return (
      <div className="mt-4 text-center text-2xl font-medium">
        No issues found
      </div>
    )
  }
  return (
    <div className="mt-4">
      <H2>Top Themes</H2>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {issues.map((issue, index) => (
          <PollsIssueCard key={issue.id} issue={issue} index={index} />
        ))}
      </div>
    </div>
  )
}
