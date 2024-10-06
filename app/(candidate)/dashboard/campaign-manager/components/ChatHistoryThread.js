import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import { dateUsHelper } from 'helpers/dateHelper';
import { useContext } from 'react';
import { BsStars } from 'react-icons/bs';
import { ChatContext } from './CampaignManagerPage';

export default function ChatHistoryThread({ chat, closeDrawer }) {
  console.log('chat', chat);
  const { loadChatByThreadId } = useContext(ChatContext);
  const handleClick = () => {
    loadChatByThreadId(chat.threadId);
    closeDrawer();
  };
  return (
    <div
      className="py-2 flex px-3 pb-3 hover:bg-primary-main rounded-md transition-colors cursor-pointer max-w-xs"
      onClick={handleClick}
    >
      <BsStars className=" opacity-50 mt-1" size={20} />
      <div className="ml-2">
        <Body1 className="line-clamp-1">{chat.name}</Body1>
        <Body2 className="mt-2 text-gray-300">
          {dateUsHelper(chat.updatedAt)}
        </Body2>
      </div>
    </div>
  );
}
