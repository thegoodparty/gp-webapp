import { Button, Card } from 'goodparty-styleguide'
import { pollIssues } from '../../tempData'
import H2 from '@shared/typography/H2'
import { MdArrowRightAlt } from 'react-icons/md'
import Link from 'next/link'

export default function PollsIssues() {
  return (
    <div className="mt-4">
      <H2>Top Themes</H2>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {pollIssues?.map((issue, index) => (
          <Card key={issue.id} className="p-4 md:p-8">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-center">
                <div className="text-sm text-gray-500 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium ml-2">{issue.summary}</div>
                  <div className="ml-2 text-sm text-gray-500">
                    {issue.mentionCount} Mentions
                  </div>
                </div>
              </div>
              <div className="mt-4">{issue.details}</div>
              <Link
                href={`/dashboard/polls/${issue.pollId}/issues/${issue.id}`}
                className="mt-12"
              >
                <Button variant="outline" className="w-full">
                  View Details
                  <MdArrowRightAlt />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
