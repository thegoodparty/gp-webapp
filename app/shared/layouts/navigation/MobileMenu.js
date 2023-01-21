'use client';
import Link from 'next/link';
import Hamburger from 'hamburger-react';
import { usePathname } from 'next/navigation';
import { GoChevronLeft } from 'react-icons/go';
import Image from 'next/image';

import { useState } from 'react';
import styles from './MobileMenu.module.scss';
import UserAvatar from '@shared/user/UserAvatar';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import { HEADER_LINKS } from './DesktopHeader';
import { RESOURCES_LINKS } from './Resources';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [showResources, setShowResources] = useState(false);
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
        className={`fixed bottom-28 p-7 right-7 bg-white text-right z-40 shadow-md rounded-md ${styles.menu}  justify-end`}
        style={{
          display: open ? 'block' : 'none',
        }}
      >
        <div className="relative mb-7">
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
        {!showResources ? (
          <div className="">
            <div>
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
            <div className="mt-7" onClick={() => setShowResources(true)}>
              Resources
            </div>
            {user?.name ? (
              <Link
                href="/profile"
                style={{ width: '100%' }}
                id="mobile-nav-profile"
              >
                <div className="mt-4 cursor-pointer flex items-center">
                  <UserAvatar user={user} />
                  <div className="ml-2">{user.name}</div>
                </div>
              </Link>
            ) : (
              <div className="mt-7">
                <Link
                  href="/register"
                  style={{
                    fontWeight: path === '/register' ? 'bold' : 'normal',
                  }}
                  id="mobile-nav-register"
                >
                  Sign Up
                </Link>
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
        ) : (
          <div className="">
            <div
              className="flex items-center mb-4"
              onClick={() => setShowResources(false)}
            >
              <GoChevronLeft />
              <span>&nbsp; Back</span>
            </div>
            <div className="mt-7 font-black text-xs">RESOURCES</div>
            {RESOURCES_LINKS.map((link, index) => (
              <div key={link.href} className="mt-7">
                <Link
                  href={link.href}
                  id={`mobile-resource-nav-${link.label.replace(' ', '-')}`}
                  key={link.href}
                  className="no-underline font-normal py-2"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
