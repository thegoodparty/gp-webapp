'use client';

import React, { useEffect, useState } from 'react';
import { hookstate, useHookstate } from '@hookstate/core';
import Link from 'next/link';
import UserAvatar from '@shared/user/UserAvatar';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { FiChevronDown } from 'react-icons/fi';
import { VscHeart } from 'react-icons/vsc';
import { RiLogoutBoxLine, RiSettingsLine } from 'react-icons/ri';
import { deleteCookies } from 'helpers/cookieHelper';

export const globalUserState = hookstate(false);

export const LINKS = [
  { label: 'Settings', href: '/profile', icon: <VscHeart /> },
  { label: 'Log out', href: '/academy', icon: <VscHeart /> },
];

export default function ClientRegisterOrProfile({ user }) {
  const userState = useHookstate(globalUserState);
  const [open, setOpen] = useState(false);
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

  const handleLogOut = () => {
    deleteCookies();
    window.location.replace('/');
  };

  return (
    <>
      {user?.name ? (
        <div
          className="flex items-center relative"
          onClick={() => setOpen(!open)}
        >
          <UserAvatar user={user} />
          <FiChevronDown
            className={`ml-1 transition-all ${open && 'rotate-180'}`}
          />
          {open ? (
            <>
              <div
                className="fixed h-screen w-screen top-0 left-0 "
                onClick={() => {
                  () => setOpen(false);
                }}
              />
              <div
                className={`absolute z-50 top-14 right-0 min-w-[270px]  bg-primary text-gray-800 rounded-xl  shadow-md transition  ${
                  open
                    ? 'p-3 overflow-hidden'
                    : 'p-0 opacity-0 overflow-visible'
                }`}
              >
                <Link
                  href="/profile/settings"
                  id={`desktop-profile-nav-settings`}
                  className="no-underline font-normal"
                >
                  <div
                    data-cy="header-link"
                    className="py-3 whitespace-nowrap text-lg px-4 hover:bg-indigo-700 hover:text-white rounded flex items-center"
                  >
                    <RiSettingsLine />
                    <div className="ml-3">Settings</div>
                  </div>
                </Link>
                <div
                  data-cy="header-link"
                  className="py-3 whitespace-nowrap text-lg px-4 hover:bg-indigo-700 hover:text-white rounded flex items-center"
                  onClick={handleLogOut}
                >
                  <RiLogoutBoxLine />
                  <div className="ml-3">Log out</div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <>
          <Link
            href="/login"
            className="px-1 cursor-pointer hover:underline"
            data-cy="header-sign-in"
            id="desktop-nav-sign-in"
          >
            <PrimaryButton size="medium">Sign in</PrimaryButton>
          </Link>
        </>
      )}
    </>
  );
}
