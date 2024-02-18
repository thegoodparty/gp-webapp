'use client';

import Link from 'next/link';
import {
  FaChevronDown,
  FaExternalLinkAlt,
  FaTheaterMasks,
  FaToolbox,
  FaUserCircle,
} from 'react-icons/fa';
import { hookstate, useHookstate } from '@hookstate/core';
import { memo, useEffect, useState } from 'react';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { deleteCookie, deleteCookies, getCookie } from 'helpers/cookieHelper';
import { HiOutlineStar } from 'react-icons/hi';
import Image from 'next/image';
import UserAvatar from '@shared/user/UserAvatar';

export const globalUserState = hookstate(false);

const links = [
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/profile',
    icon: <FaToolbox />,
  },
  // {
  //   id: 'nav-logout',
  //   label: 'Logout',
  //   href: '/logout',
  //   icon: <RiLogoutBoxFill />,
  // },
];

const handleLogOut = () => {
  deleteCookies();
  window.location.replace('/');
};

function ProfileDropdown({ open, toggleCallback, user }) {
  const [impersonating, setImpersonating] = useState(false);
  const userState = useHookstate(globalUserState);

  useEffect(() => {
    if (user) {
      userState.set(() => user);
      hubspotIntegration(user);
      fullstoryIndentity(user);
      const cookie = getCookie('impersonateToken');
      if (cookie) {
        setImpersonating(true);
      } else {
        setImpersonating(false);
      }
    }
  }, [user]);

  const hubspotIntegration = (user) => {
    var _hsq = (window._hsq = window._hsq || []);
    _hsq.push([
      'identify',
      {
        email: user.email,
        name: `${user.name} ${user.lastName}`,
      },
    ]);
  };

  const fullstoryIndentity = (userI) => {
    if (typeof FS === 'undefined') {
      return;
    }
    const impersonateUser = getCookie('impersonateUser');
    if (impersonateUser) {
      FS.shutdown();
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
    <div
      className="ml-2 relative cursor-pointer "
      onClick={toggleCallback}
      id="nav-run-dropdown"
    >
      <div>
        <div
          className={`flex items-center  rounded-full px-2 py-1 ${
            impersonating ? 'bg-orange-400' : 'bg-slate-400'
          }`}
        >
          <div className="">
            {user?.avatar ? (
              <UserAvatar user={user} size="smaller" />
            ) : (
              <FaUserCircle size={24} />
            )}
          </div>
          <FaChevronDown
            className={`ml-2 mt-[2px] transition-all ${open && 'rotate-180'}`}
          />
        </div>
      </div>

      {open ? (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0 "
            onClick={toggleCallback}
          />
          <div
            className={`absolute z-50 top-11 right-0 min-w-[270px] bg-primary text-white rounded-xl  shadow-md transition  ${
              open ? 'p-3 overflow-hidden' : 'p-0 opacity-0 overflow-visible'
            }`}
          >
            {links.map((link) => (
              <Link
                href={link.href}
                id={`nav-${link.id}`}
                key={link.id}
                className="no-underline font-medium"
                rel={`${link.external ? 'noopener noreferrer nofollow' : ''}`}
              >
                <div
                  data-cy="header-link"
                  className="py-3 whitespace-nowrap text-base px-4 hover:bg-indigo-700  rounded flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {link.icon}
                    <div className="ml-3">{link.label}</div>
                  </div>
                  {link.external && <FaExternalLinkAlt size={14} />}
                </div>
              </Link>
            ))}
            {user.isAdmin && !impersonating && (
              <Link href="/admin" className="no-underline font-normal">
                <div
                  data-cy="header-link"
                  className="py-3 whitespace-nowrap text-lg px-4 hover:bg-indigo-700 hover:text-white rounded flex items-center"
                >
                  <HiOutlineStar />
                  <div className="ml-3">Admin</div>
                </div>
              </Link>
            )}
            {impersonating && (
              <div
                data-cy="header-link"
                className="py-3 whitespace-nowrap text-lg px-4 hover:bg-indigo-700 hover:text-white rounded flex items-center"
                onClick={() => {
                  deleteCookie('impersonateToken');
                  deleteCookie('impersonateUser');
                  window.location.href = '/admin';
                }}
              >
                <FaTheaterMasks />
                <div className="ml-3">Stop Impersonating</div>
              </div>
            )}
            <div
              data-cy="header-link"
              className="py-3 whitespace-nowrap text-base px-4 hover:bg-indigo-700  rounded flex items-center justify-between"
              onClick={handleLogOut}
            >
              <div className="flex items-center">
                <RiLogoutBoxFill />
                <div className="ml-3">Logout</div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default memo(ProfileDropdown);
