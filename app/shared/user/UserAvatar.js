import React from 'react';
import { getInitials } from '/helpers/userHelper';
import Image from 'next/image';

function UserAvatar({ user }) {
  if (!user) {
    return <></>;
  }
  return (
    <div className="h-12 w-12 rounded-full shadow-md">
      {user.avatar ? (
        <div
          className="cursor-pointer h-12 w-12 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
      ) : (
        <div className="cursor-pointer h-12 w-12 rounded-full flex items-center justify-center font-bold bg-black text-white uppercase text-xl">
          {getInitials(user)}
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
