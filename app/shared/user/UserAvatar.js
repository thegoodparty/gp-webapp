import React from 'react';
import { getInitials } from '/helpers/userHelper';
import { MdPerson } from 'react-icons/md';

function UserAvatar({ user, size = 'small' }) {
  if (!user) {
    return <></>;
  }
  let sizeClass = 'h-8 w-8';
  if (size === 'large') {
    sizeClass = 'h-12 w-12';
  } else if (size === 'smaller') {
    sizeClass = 'h-6 w-6';
  }
  return (
    <div className={`${sizeClass}`}>
      {user.avatar ? (
        <div
          className={`cursor-pointer rounded-full bg-cover bg-center ${sizeClass}`}
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
      ) : (
        <div
          className={`cursor-pointer  flex items-center justify-center font-bold  text-gray-500 uppercase text-6xl ${sizeClass}`}
        >
          <MdPerson />
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
