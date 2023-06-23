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
      id="nav-get-involbed"
    >
      <PrimaryButton variant="text" size="medium">
        <div className="font-medium text-base">Get Involved</div>
      </PrimaryButton>
    </Link>
  );
}
