'use client';

import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import {
  FaChevronDown,
  FaExternalLinkAlt,
  FaToolbox,
  FaUserCircle,
} from 'react-icons/fa';
import { memo } from 'react';
import { RiLogoutBoxFill } from 'react-icons/ri';
const links = [
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/profile/settings',
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

function ProfileDropdown({ open, toggleCallback }) {
  return (
    <div
      className="ml-2 relative cursor-pointer "
      onClick={toggleCallback}
      id="nav-run-dropdown"
    >
      <div>
        <div className="flex items-center bg-slate-400 rounded-full px-2 py-1">
          <div className="">
            <FaUserCircle size={24} />
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
            <div
              data-cy="header-link"
              className="py-3 whitespace-nowrap text-base px-4 hover:bg-indigo-700  rounded flex items-center justify-between"
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
