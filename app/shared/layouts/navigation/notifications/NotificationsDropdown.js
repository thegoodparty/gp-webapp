'use client';

import { FaBell } from 'react-icons/fa';
import NotificationsPanel from './NotificationsPanel';
import { useEffect, useState } from 'react';
import useNotifications from './useNotifications';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { NotificationDot } from '@shared/utils/NotificationDot';

export async function updateNotifications() {
  try {
    const api = gpApi.notification.update;
    return await gpFetch(api);
  } catch (e) {
    console.log('error at updateNotifications', e);
    return {};
  }
}

export default function NotificationsDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const notifications = useNotifications();
  const [showDot, setShowDot] = useState(false);
  useEffect(() => {
    if (notifications && notifications.length > 0 && !notifications[0].isRead) {
      setShowDot(true);
    }
  }, [notifications]);

  if (!user) {
    return null;
  }

  const toggleCallback = () => {
    document.body.style.overflow = open ? 'visible' : 'hidden';
    setOpen(!open);
  };

  const handleClick = async () => {
    if (open) {
      setShowDot(false);
      await updateNotifications();
    }
    toggleCallback();
  };

  const handleKeyPress = (e) => {
    if (e.key == 'Enter' || (e.key == 'Escape' && open)) handleClick();
  };

  return (
    <div
      className={`mr-2 relative cursor-pointer px-4 `}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      id="nav-notifications-dropdown"
    >
      <div role="button" tabIndex={0} className="relative">
        <FaBell size={18} />
        {showDot && <NotificationDot />}
      </div>
      {open ? (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0 bg-black bg-opacity-70"
            onClick={toggleCallback}
          />
          <div
            className="fixed md:absolute z-50 top-20 md:top-14  w-[90vw] left-[5vw] md:left-auto md:right-0 md:max-w-[460px] bg-primary-dark text-gray-300 rounded-xl  shadow-md transition h-[calc(100vh-92px)] cursor-default overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationsPanel
              notifications={notifications}
              closeNotificationCallback={toggleCallback}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
