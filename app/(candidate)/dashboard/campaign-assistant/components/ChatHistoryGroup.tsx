import Overline from '@shared/typography/Overline'
import ChatHistoryThread from 'app/(candidate)/dashboard/campaign-assistant/components/ChatHistoryThread'
import { Chat } from './ajaxActions'

interface ChatHistoryGroupProps {
  title?: string
  chats?: Chat[]
  closeDrawer?: () => void
}

export const ChatHistoryGroup = ({
  title = '',
  chats = [],
  closeDrawer = () => {},
}: ChatHistoryGroupProps): React.JSX.Element => {
  return (
    <>
      {chats.length > 0 && (
        <div className="p-6 mt-3">
          <Overline className="mb-2 text-gray-400">{title}</Overline>
          <div className="">
            {chats.map((chat) => (
              <ChatHistoryThread
                key={chat.threadId}
                chat={chat}
                closeDrawer={closeDrawer}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
