'use client';
import H3 from '@shared/typography/H3';
import Notification from './Notification';

export default function NotificationsList({ notifications }) {
  return (
    <div className="">
      {notifications.map((notification) => (
        <Notification notification={notification} key={notification.id} />
      ))}
      {notifications.length === 0 && (
        <H3 className="mt-3 text-center">No notifications</H3>
      )}
    </div>
  );
}
