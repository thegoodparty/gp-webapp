'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { hookstate, useHookstate } from '@hookstate/core';
import { getUserCookie } from 'helpers/cookieHelper';
import RegisterModal from '../RegisterModal';
import Link from 'next/link';
import UserAvatar from '@shared/user/UserAvatar';
import Image from 'next/image';

export const globalUserState = hookstate(false);

export default function NavRegisterOrProfile() {
  const [showRegister, setShowRegister] = useState(false);

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
          <strong
            className="mx-3 px-1 cursor-pointer hover:underline"
            data-cy="header-register"
            id="desktop-nav-register"
            onClick={() => setShowRegister(true)}
          >
            Join Us
          </strong>

          {showRegister && (
            <Suspense>
              <RegisterModal
                closeModalCallback={() => {
                  setShowRegister(false);
                }}
              />
            </Suspense>
          )}
        </>
      )}
    </>
  );
}
