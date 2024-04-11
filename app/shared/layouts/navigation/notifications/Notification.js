import Caption from '@shared/typography/Caption';
import H6 from '@shared/typography/H6';
import Subtitle2 from '@shared/typography/Subtitle2';
import { dateUsHelper } from 'helpers/dateHelper';
import Link from 'next/link';
import { AiOutlineFlag } from 'react-icons/ai';
import { GiFairyWand } from 'react-icons/gi';

const TypeIcon = (type) => {
  const baseClass =
    'rounded-full flex items-center justify-center w-9 h-9 text-primary';
  if (type === 'content') {
    return (
      <div className={`${baseClass} bg-cyan-400`}>
        <GiFairyWand />
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

export default function Notifications({
  notification,
  closeNotificationCallback,
}) {
  const { data, createdAt, isRead } = notification;

  const { type, title, link, subTitle, dueDate } = data;
  return (
    <Link
      href={link}
      className="no-underline"
      onClick={closeNotificationCallback}
    >
      <div className="py-3 px-5 border-t border-primary-dark flex justify-between items-center transition-colors hover:bg-primary-dark-dark">
        <div className="flex">
          <div>{TypeIcon(type)}</div>
          <div className="px-3">
            <H6 className="text-slate-100">{title}</H6>
            <Caption className="text-gray-600">{subTitle}</Caption>
            <Subtitle2
              className={`mt-6 ${isRead ? 'text-gray-600' : 'text-red-200'}`}
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
              !isRead ? 'bg-red-400' : ''
            }`}
          />
        </div>
      </div>
    </Link>
  );
}
