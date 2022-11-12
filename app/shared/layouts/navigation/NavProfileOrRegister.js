'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, usePathname } from 'next/navigation';

import { getUserCookie } from '/helpers/cookieHelper';
import UserAvatar from '../../user/UserAvatar';
import RegisterModal from '../RegisterModal';

const NavProfileOrRegister = () => {
  const searchParams = useSearchParams();
  const registerQuery = searchParams.get('register');

  const [user, setUser] = useState(false);
  const [registerRoute, setRegisterRoute] = useState('');

  useEffect(() => {
    const user = getUserCookie(true);
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const registerParam = searchParams.get('register');
    if (registerParam === 'true') {
      setRegisterRoute(true);
    } else {
      setRegisterRoute(false);
    }
  }, [registerQuery]);

  return (
    <>
      {user?.name ? (
        <Link href="/profile" id="desktop-nav-profile">
          <UserAvatar user={user} />
        </Link>
      ) : (
        <Link
          href={`/?register=true`}
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
      {registerRoute && (
        <Suspense>
          <RegisterModal />
        </Suspense>
      )}
    </>
  );
};

export default NavProfileOrRegister;
