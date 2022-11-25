'use client';
import Link from 'next/link';
import Hamburger from 'hamburger-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { Suspense, useState } from 'react';
import styles from './MobileMenu.module.scss';
import UserAvatar from '@shared/user/UserAvatar';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import RegisterModal from '../RegisterModal';
import LoginModal from '../LoginModal';
export const HEADER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Candidates', href: '/candidates' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const path = usePathname();
  const userState = useHookstate(globalUserState);
  const user = userState.get();
  return (
    <div className={styles.wrapper}>
      <Hamburger
        toggled={open}
        toggle={setOpen}
        size={26}
        color="#747779"
        rounded
        label="Show menu"
      />
      <div
        className={`fixed bottom-28 p-7 right-7 bg-white text-center z-40 shadow-md ${styles.menu}`}
        style={{
          display: open ? 'block' : 'none',
        }}
      >
        <div>
          <Link href="/" className="text-center" id="mobile-nav-logo">
            <Image
              src="/images/black-logo.svg"
              alt="Good Party"
              data-cy="logo"
              width={174}
              height={20}
              className="self-center justify-self-center"
            />
          </Link>
        </div>
        <div className="mt-7">
          <Link
            href="/"
            id="mobile-nav-home"
            style={{ fontWeight: path === '/' ? 'bold' : 'normal' }}
          >
            Home
          </Link>
        </div>
        {HEADER_LINKS.map((link) => (
          <div key={link.href} className="mt-7">
            <Link
              href={link.href}
              id={`mobile-nav-${link.label.replace(' ', '-')}`}
              style={{ fontWeight: path === link.href ? 'bold' : 'normal' }}
            >
              {link.label}
            </Link>
          </div>
        ))}

        {user?.name ? (
          <Link
            href="/profile"
            style={{ width: '100%' }}
            id="mobile-nav-profile"
          >
            <div className="mt-3 cursor-pointer flex items-center">
              <UserAvatar user={user} />
              <div className="ml-2">{user.name}</div>
            </div>
          </Link>
        ) : (
          <div
            className="mt-7"
            style={{ fontWeight: path === '/register' ? 'bold' : 'normal' }}
            id="mobile-nav-register"
            onClick={() => setShowRegister(true)}
          >
            Sign Up
          </div>
        )}
        {user?.isAdmin && (
          <div className="mt-3">
            <Link href="/admin" className="text-center">
              Admin
            </Link>
          </div>
        )}
      </div>
      {showRegister && (
        <Suspense>
          <RegisterModal
            closeModalCallback={() => {
              setShowRegister(false);
            }}
            openLoginCallback={() => {
              setShowLogin(true);
            }}
          />
        </Suspense>
      )}
      {showLogin && (
        <Suspense>
          <LoginModal
            closeModalCallback={() => {
              setShowLogin(false);
            }}
            openRegisterCallback={() => {
              setShowRegister(true);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
