import WarningButton from '@shared/buttons/WarningButton';
import H2 from '@shared/typography/H2';
import Tabs from '@shared/utils/Tabs';
import { FiSettings } from 'react-icons/fi';
import NotificationsList from './NotificationsList';

export default function NotificationsPanel({}) {
  return (
    <div className="">
      <div className="flex justify-between items-center text-slate-100 py-5 px-6">
        <H2>Notifications</H2>
        <div className="flex items-center">
          <WarningButton size="small">Mark all as read</WarningButton>
          <FiSettings className="ml-2" />
        </div>
      </div>
      <Tabs
        color="#DFF265"
        size="small"
        tabLabels={['All', 'Unread']}
        tabPanels={[
          <NotificationsList key="all" />,
          <NotificationsList unreadOnly key="unread" />,
        ]}
      />
    </div>
  );
}
