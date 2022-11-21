import React from 'react';
import ProfileLeftMenu from '@shared/layouts/ProfileLeftMenu';

const ProfilePageLayout = ({ children }) => {
  return (
    <div className="bg-zinc-100">
      <div className="max-w-7xl my-0 mx-auto py-16 px-0 lg:flex lg:flex-row">
        <ProfileLeftMenu />
        <div className="flex-1 max-w-full lg:max-w-[calc(100%-220px)]">{children}</div>
      </div>
    </div>
  );
};
export default ProfilePageLayout;
