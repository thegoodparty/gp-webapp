import Body1 from '@shared/typography/Body1';
import { dateUsHelper } from 'helpers/dateHelper';
import { BsStars } from 'react-icons/bs';

export default function ChatHistoryThread({ chat }) {
  return (
    <div className="py-2 px-3 flex pb-3 hover:bg-primary-main rounded-md transition-colors cursor-pointer">
      <BsStars className=" opacity-50" />
      <Body1 className="ml-2">{dateUsHelper(chat.updatedAt)}</Body1>
    </div>
  );
}
