'use client'
import Body1 from '@shared/typography/Body1'
import Body2 from '@shared/typography/Body2'
import { dateUsHelper } from 'helpers/dateHelper'
import { MdAutoAwesome } from 'react-icons/md'
import DeleteThread from './DeleteThread'
import useChat from 'app/(candidate)/dashboard/campaign-assistant/components/useChat'
import { Chat } from './ajaxActions'

interface ChatHistoryThreadProps {
  chat: Chat
  closeDrawer: () => void
}

const ChatHistoryThread = ({
  chat,
  closeDrawer,
}: ChatHistoryThreadProps): React.JSX.Element => {
  const { loadChatByThreadId } = useChat()
  const handleClick = () => {
    loadChatByThreadId(chat.threadId)
    closeDrawer()
  }
  return (
    <div
      className="py-2 flex justify-between px-3 pb-3 hover:bg-primary-main rounded-md transition-colors cursor-pointer max-w-xs"
      onClick={handleClick}
    >
      <div className="flex">
        <MdAutoAwesome className=" opacity-50 mt-1" size={20} />
        <div className="ml-2">
          <Body1 className="line-clamp-1">{chat.name}</Body1>
          <Body2 className="mt-2 text-gray-300">
            {dateUsHelper(chat.updatedAt)}
          </Body2>
        </div>
      </div>
      <DeleteThread chat={chat} />
    </div>
  )
}

export default ChatHistoryThread
