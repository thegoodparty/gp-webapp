'use client';

import H2 from '@shared/typography/H2';
import { FaBell } from 'react-icons/fa';
import NotificationsPanel from './NotificationsPanel';

export default function NotificationsDropdown({
  open,
  toggleCallback,
  user,
  closeAll,
}) {
  if (!user) {
    return null;
  }
  const handleClick = () => {
    closeAll();
    toggleCallback();
  };
  return (
    <div
      className={`mr-2 relative cursor-pointer px-4 `}
      onClick={handleClick}
      id="nav-notifications-dropdown"
    >
      <div className="relative">
        <FaBell />
        <div className="absolute w-2 h-2 bg-red-400 rounded-full -top-1 -right-2"></div>
      </div>
      {open ? (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0 bg-black bg-opacity-70"
            onClick={toggleCallback}
          />
          <div
            className="absolute z-50 top-14 right-0 min-w-[270px] md:w-[460px] bg-primary text-gray-800 rounded-xl  shadow-md transition h-[calc(100vh-92px)] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationsPanel />
          </div>
        </>
      ) : null}
    </div>
  );
}
