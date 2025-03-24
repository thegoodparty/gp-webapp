import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import Paper from '@shared/utils/Paper';
import { useTextMessaging } from 'app/shared/hooks/useTextMessaging';
import Request from './Request';
export default function TextMessagingRequests() {
  const [textMessaging] = useTextMessaging();
  console.log('textMessaging', JSON.stringify(textMessaging, null, 2));
  return (
    <Paper>
      <H2 className="mb-4">Text Messaging Requests</H2>
      <div className="grid grid-cols-12 gap-4">
        {textMessaging.map((request) => (
          <div
            className="col-span-12 md:col-span-6 lg:col-span-4"
            key={request.id}
          >
            <Request request={request} />
          </div>
        ))}
      </div>
    </Paper>
  );
}
