'use client'
import { Button, Card } from 'goodparty-styleguide'
import { MdArrowRightAlt } from 'react-icons/md'
import Link from 'next/link'
import { usePoll } from '../../shared/hooks/PollProvider'

interface PollIssue {
  title?: string
  summary?: string
  mentionCount?: number
}

interface PollsIssueCardProps {
  issue?: PollIssue
  index: number
}

export default function PollsIssueCard({
  issue = {},
  index,
}: PollsIssueCardProps): React.JSX.Element {
  const [poll] = usePoll()
  const { title, summary, mentionCount } = issue
  return (
    <Card className="p-4 md:p-8">
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center">
          <div
            className="text-sm h-12 w-12 font-semibold mr-4 rounded-full bg-blue-100 flex items-center justify-center"
            aria-label={`Rank ${index + 1}`}
          >
            #{index + 1}
          </div>
          <div>
            <div className="font-medium ">{title}</div>
            <div className="text-sm text-gray-500">{mentionCount} Mentions</div>
          </div>
        </div>
        <div className="mt-4">{summary}</div>
        <Link
          href={`/dashboard/polls/${poll.id}/issue/${index}`}
          className="mt-12"
        >
          <Button variant="outline" className="w-full">
            View Details
            <MdArrowRightAlt />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
