import Link from 'next/link';
import { NotificationDot } from '@shared/utils/NotificationDot';

export const DashboardMenuItem = ({
  id,
  section,
  link,
  icon,
  children,
  onClick,
  pathname,
  notificationDot,
}) => {
  return (
    <>
      {section && (
        <div className="font-medium text-sm mt-4 px-3">{section}</div>
      )}
      <Link href={link} className="no-underline" onClick={onClick} id={id}>
        <div
          className={`text-[17px] py-3 px-3 flex items-center rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark ${
            pathname === link && 'text-slate-50 bg-primary-dark-dark'
          }`}
        >
          {icon || null}
          <div className="relative">
            <div className="ml-2">{children}</div>
            {notificationDot && <NotificationDot />}
          </div>
        </div>
      </Link>
    </>
  );
};
