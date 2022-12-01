'use client';
import React from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '../../../utils/constants';
import { usePathname } from 'next/navigation';
export const leftMenuItems = [
  {
    label: 'Profile',
    link: '/profile',
  },
  {
    label: 'Settings',
    link: '/profile/settings',
  },
  {
    label: 'Campaigns',
    link: '/profile/campaigns',
  },
];

export const leftMenuItemsBottom = [
  {
    label: 'FAQs',
    link: '/faqs',
  },
  {
    label: 'Need Help?',
    link: `/contact`,
  },
];
const ProfilePageLayout = ({ children, params }) => {
  const pathname = usePathname();
  return (
    <div className="bg-zinc-100">
      <div className="max-w-7xl my-0 mx-auto py-16 px-0 lg:flex lg:flex-row">
        <div className="p-0 pr-2.5 pb-5 pl-2.5 text-center lg:w-[220px] lg:overflow-x-hidden lg:mt-16 lg:mr-2.5 lg:mb-0 lg:ml-2.5 lg:text-left">
          {leftMenuItems.map((item) => (
            <React.Fragment key={item.label}>
              <Link href={item.link} passHref>
                <div
                  className={`inline-block pr-5 pb-4 lg:block lg:pb-8 lg:pr-0 text-base tracking-wide ${
                    pathname === item.link
                      ? 'font-black text-black'
                      : 'text-zinc-600 font-light'
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            </React.Fragment>
          ))}
          <div className="hidden lg:block">
            <div className="h-24">&nbsp;</div>
            {leftMenuItemsBottom.map((item) => (
              <Link href={item.link} passHref key={item.label}>
                <div
                  className={`inline-block pr-5 pb-4 lg:block lg:pb-8 lg:pr-0 text-base tracking-wide ${
                    pathname === item.link
                      ? 'font-black text-black'
                      : 'text-zinc-600 font-light'
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1 max-w-full lg:max-w-[calc(100%-220px)]">
          {children}
        </div>
      </div>
    </div>
  );
};
export default ProfilePageLayout;
