import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import { useTextMessaging } from 'app/shared/hooks/useTextMessaging'
import TextMessagingRequest from './TextMessagingRequest'
import Body2 from '@shared/typography/Body2'
export default function TextMessagingRequests() {
  const { textMessaging } = useTextMessaging()
  return (
    <Paper>
      <H2 className="mb-4">Text Messaging Requests</H2>
      <div className="grid grid-cols-12 gap-4">
        {!Array.isArray(textMessaging) || textMessaging.length === 0 ? (
          <div className="col-span-12">
            <Body2>No text messaging requests found</Body2>
          </div>
        ) : (
          textMessaging.map((request) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4"
              key={request.id}
            >
              <TextMessagingRequest request={request} />
            </div>
          ))
        )}
      </div>
    </Paper>
  )
}
