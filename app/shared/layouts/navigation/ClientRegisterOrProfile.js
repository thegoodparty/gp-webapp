'use client';

import React, { useEffect } from 'react';
import { hookstate, useHookstate } from '@hookstate/core';
import Link from 'next/link';
import UserAvatar from '@shared/user/UserAvatar';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export const globalUserState = hookstate(false);

export default function ClientRegisterOrProfile({ user }) {
  const userState = useHookstate(globalUserState);
  useEffect(() => {
    if (user) {
      userState.set(() => user);
      hubspotIntegration(user);
      fullstoryIndentity(user);
    }
  }, [user]);

  const hubspotIntegration = (user) => {
    var _hsq = (window._hsq = window._hsq || []);
    _hsq.push([
      'identify',
      {
        email: user.email,
        name: user.name,
      },
    ]);
  };

  const fullstoryIndentity = (userI) => {
    if (typeof FS === 'undefined') {
      return;
    }
    if (userI && userI.email) {
      const domain = userI.email.split('@')[1];
      if (domain === 'goodparty.org') {
        FS.shutdown();
      } else {
        FS.identify(userI.id, {
          displayName: userI.name,
          email: userI.email,
        });
      }
    }
  };

  return (
    <>
      {user?.name ? (
        <>
          <Link href="/profile" id="desktop-nav-profile">
            <UserAvatar user={user} />
          </Link>
          {/* {user?.isAdmin && (
            <div className="shadow-md h-12 w-12 ml-4 flex justify-center items-center rounded-full">
              <Link href="/admin">
                <Image
                  src="/images/heart.svg"
                  width={30}
                  height={26}
                  alt="admin"
                  priority
                />
              </Link>
            </div>
          )} */}
        </>
      ) : (
        <>
          <Link
            href="/register"
            className="px-1 cursor-pointer hover:underline"
            data-cy="header-register"
            id="desktop-nav-register"
          >
            <PrimaryButton size="medium">Sign in</PrimaryButton>
          </Link>
        </>
      )}
    </>
  );
}
