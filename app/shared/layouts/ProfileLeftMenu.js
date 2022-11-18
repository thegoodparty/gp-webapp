

import React from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '../../../utils/constants';

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
    link: `mailto:${CONTACT_EMAIL}`,
  },
];

function PortalLeftMenu() {
  let pathname = '';
  if (typeof window !== 'undefined') {
    ({ pathname } = window.location);
  }
  
  return (
    <div className="p-0 pr-2.5 pb-5 pl-2.5 text-center lg:w-[220px] lg:overflow-x-hidden lg:mt-16 lg:mr-2.5 lg:mb-0 lg:ml-2.5 lg:text-left">
      {leftMenuItems.map((item) => (
        <React.Fragment key={item.label}>
          <Link href={item.link} passHref>
            <div className={`inline-block text-zinc-600 pr-5 pb-4 lg:block lg:pb-8 lg:pr-0 font-16 ${pathname === item.link ? 'font-black text-black' : ''}`}>
              {item.label}
            </div>
          </Link>
        </React.Fragment>
      ))}
      <div className="hidden lg:block">
        <div className="h-24">&nbsp;</div>
        {leftMenuItemsBottom.map((item) => (
          <Link href={item.link} passHref key={item.label}>
            <div className={`inline-block text-zinc-600 pr-5 pb-4 lg:block lg:pb-8 lg:pr-0 font-16 ${pathname === item.link ? 'font-black text-black' : ''}`}>
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PortalLeftMenu;
