import H1 from '@shared/typography/H1'
import { useIssue } from '../hooks/IssueProvider'
import Link from 'next/link'
import { IoArrowBack } from 'react-icons/io5'
import { usePoll } from '../../../hooks/PollProvider'
import Body1 from '@shared/typography/Body1'

export default function Title() {
  const [issue] = useIssue()
  const [poll] = usePoll()
  const { title, summary } = issue
  return (
    <div className="my-4">
      <div className="flex items-center gap-3 mb-2">
        <Link href={`/dashboard/polls/${poll.id}`} aria-label="Back to poll">
          <IoArrowBack />
        </Link>
        <H1>{title}</H1>
      </div>
      <Body1 className="text-gray-600">{summary}</Body1>
    </div>
  )
}
