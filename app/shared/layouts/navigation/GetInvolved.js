'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { VscHeart } from 'react-icons/vsc';
import { SlGraduation } from 'react-icons/sl';
import { RiHandHeartLine, RiProfileLine } from 'react-icons/ri';
import { TfiList } from 'react-icons/tfi';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import OfficeOrContinueLink from './OfficeOrContinueLink';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';

export const RESOURCES_LINKS = [
  { label: 'About', href: '/about', icon: <VscHeart /> },
  { label: 'Academy', href: '/academy', icon: <SlGraduation /> },
  { label: 'Blog', href: '/blog', icon: <RiProfileLine /> },
  { label: 'Glossary', href: '/political-terms', icon: <TfiList /> },
  { label: 'Volunteer', href: '/volunteer', icon: <RiHandHeartLine /> },
];

export default function GetInvolved({ closeAll, campaignStatus }) {
  const { status } = campaignStatus || {};
  return (
    <Link
      href="/volunteer"
      className={`mr-4 relative cursor-pointer min-w-[100px] hidden  ${
        status ? ' lg:hidden' : 'lg:block'
      }`}
      onClick={closeAll}
    >
      <PrimaryButton variant="text" size="medium">
        <div className="font-medium text-base">Get Involved</div>
      </PrimaryButton>

      {/* {open ? (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0 "
            onClick={toggleCallback}
          />
          <div
            className={`absolute z-50 top-14 right-0 min-w-[270px]  bg-primary text-gray-800 rounded-xl  shadow-md transition  ${
              open ? 'p-3 overflow-hidden' : 'p-0 opacity-0 overflow-visible'
            }`}
          >
            {RESOURCES_LINKS.map((link) => (
              <Link
                href={link.href}
                id={`desktop-learn-more-nav-${link.label.replace(' ', '-')}`}
                key={link.href}
                className="no-underline font-normal"
              >
                <div
                  data-cy="header-link"
                  className="py-3 whitespace-nowrap text-lg px-4 hover:bg-indigo-700 hover:text-white rounded flex items-center"
                  //   style={activeUrl === link.href ? { fontWeight: 'bold' } : {}}
                >
                  {link.icon}
                  <div className="ml-3">{link.label}</div>
                </div>
              </Link>
            ))}
            {!status && (
              <Link
                href="run-for-office"
                className="font-medium mr-5 lg:hidden"
                id="header-run-for-office"
              >
                <WarningButton size="medium" fullWidth>
                  Run for Office
                </WarningButton>
              </Link>
            )}
          </div>
        </>
      ) : null} */}
    </Link>
  );
}
