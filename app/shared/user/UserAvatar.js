import React from 'react';
import { getInitials } from '/helpers/userHelper';

function UserAvatar({ user }) {
  if (!user) {
    return <></>;
  }
  return (
    <div className="h-8 w-8 rounded-full">
      {user.avatar ? (
        <div
          className="cursor-pointer h-8 w-8 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
      ) : (
        <div className="cursor-pointer h-8 w-8 rounded-full flex items-center justify-center font-bold bg-black text-white uppercase text-sm">
          {getInitials(user)}
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
