'use client';

import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { VscHeart } from 'react-icons/vsc';
import { SlGraduation } from 'react-icons/sl';
import { RiHandHeartLine, RiProfileLine } from 'react-icons/ri';
import { TfiList } from 'react-icons/tfi';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';

export const RESOURCES_LINKS = [
  { label: 'About', href: '/about', icon: <VscHeart /> },
  { label: 'Academy', href: '/academy', icon: <SlGraduation /> },
  { label: 'Blog', href: '/blog', icon: <RiProfileLine /> },
  { label: 'Glossary', href: '/political-terms', icon: <TfiList /> },
];

export default function LearnMore({ open, toggleCallback, campaignStatus }) {
  const { status } = campaignStatus || {};
  return (
    <div
      className={`mr-2 relative cursor-pointer min-w-[100px] ${
        status && 'hidden lg:block'
      }`}
      onClick={toggleCallback}
    >
      <PrimaryButton variant="text" size="medium">
        <div className="flex items-center">
          <div className="font-medium text-base">Learn More</div>
          <FiChevronDown
            className={`ml-1 transition-all ${open && 'rotate-180'}`}
          />
        </div>
      </PrimaryButton>

      {open ? (
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
                >
                  {link.icon}
                  <div className="ml-3">{link.label}</div>
                </div>
              </Link>
            ))}
            {!status && (
              <>
                <div className="my-2">
                  <Link
                    href="/volunteer"
                    className="font-medium mr-5  lg:hidden"
                    id="header-get-involved"
                  >
                    <WarningButton size="medium" variant="outlined" fullWidth>
                      <span className="font-medium">Get Involved</span>
                    </WarningButton>
                  </Link>
                </div>
                <Link
                  href="run-for-office"
                  className="font-medium mr-5 lg:hidden"
                  id="header-run-for-office"
                >
                  <WarningButton size="medium" fullWidth>
                    <span className="font-medium">Run for Office</span>
                  </WarningButton>
                </Link>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
