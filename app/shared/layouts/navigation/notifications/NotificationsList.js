'use client';
import Notification from './Notification';

export default function NotificationsList({ notifications }) {
  return (
    <div className="">
      {notifications.map((notification) => (
        <Notification notification={notification} key={notification.id} />
      ))}
    </div>
  );
}
