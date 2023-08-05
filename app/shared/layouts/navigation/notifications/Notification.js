import Caption from '@shared/typography/Caption';
import H6 from '@shared/typography/H6';
import Subtitle2 from '@shared/typography/Subtitle2';
import { dateUsHelper } from 'helpers/dateHelper';
import Link from 'next/link';
import { AiOutlineFlag } from 'react-icons/ai';
import { BiBook } from 'react-icons/bi';

const TypeIcon = (type) => {
  const baseClass =
    'rounded-full flex items-center justify-center w-9 h-9 text-primary';
  if (type === 'blog') {
    return (
      <div className={`${baseClass} bg-cyan-400`}>
        <BiBook />
      </div>
    );
  }
  if (type === 'goal') {
    return (
      <div className={`${baseClass} bg-orange-300`}>
        <AiOutlineFlag />
      </div>
    );
  }
};

export default function Notifications({ notification }) {
  const { type, title, link, subTitle, status, createdAt, dueDate } =
    notification;
  return (
    <Link href={link} className="no-underline">
      <div className="py-3 px-5 border-b border-indigo-700 flex justify-between items-center transition-colors hover:bg-indigo-700">
        <div className="flex">
          <div>{TypeIcon(type)}</div>
          <div className="px-3">
            <H6 className="text-slate-100">{title}</H6>
            <Caption className="text-indigo-300">{subTitle}</Caption>
            <Subtitle2
              className={`mt-6 ${
                status === 'read' ? 'text-indigo-300' : 'text-red-200'
              }`}
            >
              Due {dateUsHelper(dueDate)}
            </Subtitle2>
          </div>
        </div>
        <div className="shrink-0 flex items-center">
          <Subtitle2 className="text-indigo-400">
            {dateUsHelper(createdAt)}
          </Subtitle2>
          <div
            className={`w-2 h-2  rounded-full ml-2 ${
              status === 'unread' ? 'bg-red-400' : ''
            }`}
          />
        </div>
      </div>
    </Link>
  );
}
