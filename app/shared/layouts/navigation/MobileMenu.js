'use client';
import Link from 'next/link';
import Hamburger from 'hamburger-react';
import { usePathname } from 'next/navigation';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import Image from 'next/image';

import { useState } from 'react';
import styles from './MobileMenu.module.scss';
import UserAvatar from '@shared/user/UserAvatar';
import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/ClientRegisterOrProfile';
import { RESOURCES_LINKS } from './LearnMore';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showCandResources, setShowCandResources] = useState(false);
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
        {!showResources && !showCandResources ? (
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

            <div
              className="mt-7 cursor-pointer flex items-center justify-end"
              onClick={() => setShowResources(true)}
            >
              Resources <GoChevronRight />
            </div>
            <div
              className="mt-7 cursor-pointer flex items-center justify-end"
              onClick={() => setShowCandResources(true)}
            >
              Candidate Resources <GoChevronRight />
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
          <>
            {showResources && (
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
            {showCandResources && (
              <div className="">
                <div
                  className="flex items-center mb-4"
                  onClick={() => setShowCandResources(false)}
                >
                  <GoChevronLeft />
                  <span>&nbsp; Back</span>
                </div>
                <div className="mt-7 font-black text-xs">
                  CANDIDATE RESOURCES
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
