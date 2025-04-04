import Overline from '@shared/typography/Overline'
import ChatHistoryThread from 'app/(candidate)/dashboard/campaign-assistant/components/ChatHistoryThread'

export const ChatHistoryGroup = ({
  title = '',
  chats = [],
  closeDrawer = () => {},
}) => {
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
