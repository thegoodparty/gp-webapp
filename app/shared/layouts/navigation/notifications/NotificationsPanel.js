import H2 from '@shared/typography/H2';
import { FiSettings } from 'react-icons/fi';
import NotificationsList from './NotificationsList';

export default function NotificationsPanel({ notifications }) {
  return (
    <div className="">
      <div className="flex justify-between items-center text-slate-100 py-5 px-6">
        <H2>Notifications</H2>
        <FiSettings />
      </div>
      <NotificationsList notifications={notifications} />,
    </div>
  );
}
