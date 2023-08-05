'use client';
import { Fragment } from 'react';
import Notification from './Notification';
const notifications = [
  {
    id: '1',
    type: 'goal',
    title: 'Knock on 100 doors this week',
    link: '',
    subTitle: 'Campaign tracker',
    status: 'unread',
    createdAt: '7/23/2023',
    dueDate: '8/1/2023',
  },
  {
    id: '2',
    type: 'blog',
    title:
      'Read: Nashville Council District 17 Voter Guide: What to Know in South Nashville',
    link: '/blog',
    subTitle: 'Campaign tracker',
    status: 'unread',
    createdAt: '7/28/2023',
    dueDate: '8/8/2023',
  },
  {
    id: '3',
    type: 'blog',
    title: 'Figure out where these notifications will come from',
    link: '/blog',
    subTitle: 'Campaign tracker',
    status: 'read',
    createdAt: '7/22/2023',
    dueDate: '9/8/2023',
  },
];
export default function NotificationsList({ unreadOnly }) {
  return (
    <div className="">
      {notifications.map((notification) => (
        <Fragment key={notification.id}>
          {(!unreadOnly ||
            (unreadOnly && notification.status === 'unread')) && (
            <Notification notification={notification} key={notification.id} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
