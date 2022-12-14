'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { hookstate, useHookstate } from '@hookstate/core';
import { getUserCookie } from 'helpers/cookieHelper';
import Link from 'next/link';
import UserAvatar from '@shared/user/UserAvatar';
import Image from 'next/image';

export const globalUserState = hookstate(false);

export default function NavRegisterOrProfile() {
  const [hasMounted, setHasMounted] = React.useState(false);

  const userState = useHookstate(globalUserState);
  useEffect(() => {
    setHasMounted(true);
    const user = getUserCookie(true);
    if (user) {
      setTimeout(() => {
        userState.set(() => user);
      }, 100);
    }
  }, []);

  const user = userState.get();

  return (
    <>
      {hasMounted && user?.name ? (
        <>
          <Link href="/profile" id="desktop-nav-profile">
            <UserAvatar user={user} />
          </Link>
          {user?.isAdmin && (
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
          )}
        </>
      ) : (
        <>
          <Link
            href="/register"
            className="mx-3 px-1 cursor-pointer hover:underline"
            data-cy="header-register"
            id="desktop-nav-register"
          >
            <strong>Join Us</strong>
          </Link>
        </>
      )}
    </>
  );
}
