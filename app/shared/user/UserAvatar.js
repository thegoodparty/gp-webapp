import React from 'react';
import { getInitials } from '/helpers/userHelper';

function UserAvatar({ user, size = 'small' }) {
  if (!user) {
    return <></>;
  }
  const sizeClass = size === 'small' ? 'h-8 w-8' : 'h-12 w-12';
  return (
    <div className={`rounded-full ${sizeClass}`}>
      {user.avatar ? (
        <div
          className={`cursor-pointer rounded-full bg-cover bg-center ${sizeClass}`}
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
      ) : (
        <div
          className={`cursor-pointer rounded-full flex items-center justify-center font-bold bg-black text-white uppercase text-sm ${sizeClass}`}
        >
          {getInitials(user)}
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
