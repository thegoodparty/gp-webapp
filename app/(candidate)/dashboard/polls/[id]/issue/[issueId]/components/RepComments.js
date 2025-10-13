import H4 from '@shared/typography/H4'
import { LuMessagesSquare } from 'react-icons/lu'
import Body1 from '@shared/typography/Body1'
import { useIssue } from 'app/(candidate)/dashboard/polls/shared/hooks/IssueProvider'
import Body2 from '@shared/typography/Body2'

export default function RepComments() {
  const [issue] = useIssue()
  const { representativeComments } = issue
  return (
    <div className="mt-8 max-w-[600px]">
      <div className="flex items-center gap-2">
        <LuMessagesSquare />
        <H4>Representative Comments</H4>
      </div>

      <Body1 className="mt-4">
        {representativeComments.map((comment, index) => (
          <div
            key={index}
            className={`mt-4 pb-4  ${
              index !== representativeComments.length - 1
                ? 'border-b border-gray-200'
                : ''
            }`}
          >
            <div className="flex gap-4 ">
              <div className="w-1 flex-shrink-0 bg-blue-100 "></div>
              <i>{comment.comment}</i>
            </div>
            {comment.name && (
              <Body2 className="text-right text-gray-500 font-semibold mt-2">
                {comment.name}
              </Body2>
            )}
          </div>
        ))}
        {representativeComments && representativeComments.length === 0 && (
          <Body1 className="mt-4">No representative comments found</Body1>
        )}
      </Body1>
    </div>
  )
}
