'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { hookstate, useHookstate } from '@hookstate/core';
import Link from 'next/link';
import Image from 'next/image';

import { getUserCookie } from '/helpers/cookieHelper';
import UserAvatar from '../../user/UserAvatar';

export const globalUserState = hookstate(false);

const NavProfileOrRegister = () => {
  const userState = useHookstate(globalUserState);

  useEffect(() => {
    const user = getUserCookie(true);
    if (user) {
      userState.set(() => user);
    }
  }, []);

  const user = userState.get();
  return (
    <>
      {user?.name ? (
        <Link href="/profile" id="desktop-nav-profile">
          <UserAvatar user={user} />
        </Link>
      ) : (
        <Link
          href="/?register=true"
          data-cy="header-register"
          id="desktop-nav-register"
        >
          <strong className="mx-3 px-1">Join Us</strong>
        </Link>
      )}
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
  );
};

export default NavProfileOrRegister;
