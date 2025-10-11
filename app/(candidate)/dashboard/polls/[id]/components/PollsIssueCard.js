'use client'
import { Button, Card } from 'goodparty-styleguide'
import { MdArrowRightAlt } from 'react-icons/md'
import Link from 'next/link'
import { usePoll } from '../hooks/PollProvider'

export default function PollsIssueCard({ issue, index }) {
  const [poll] = usePoll()
  const { summary, details, mentionCount, id } = issue
  return (
    <Card className="p-4 md:p-8">
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center">
          <div
            className="text-sm text-gray-500 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center"
            aria-label={`Rank ${index + 1}`}
          >
            {index + 1}
          </div>
          <div>
            <div className="font-medium ml-2">{summary}</div>
            <div className="ml-2 text-sm text-gray-500">
              {mentionCount} Mentions
            </div>
          </div>
        </div>
        <div className="mt-4">{details}</div>
        <Link
          href={`/dashboard/polls/${poll.id}/issue/${id}`}
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
