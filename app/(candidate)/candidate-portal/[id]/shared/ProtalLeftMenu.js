import { getServerUser } from 'helpers/userServerHelper';
import Link from 'next/link';
import { Fragment } from 'react';

export const leftMenuItems = [
  {
    label: 'Analytics Dashboard',
    link: '/candidate-portal',
  },
  {
    label: 'Campaign Page & Info',
    link: '/candidate-portal/campaign-manager',
  },

  {
    label: 'Policy Issues',
    link: '/candidate-portal/top-issues',
  },
  {
    label: 'Key Endorsers',
    link: '/candidate-portal/endorsements',
  },
];

export const leftMenuItemsBottom = [
  {
    label: 'Campaign Guide',
    link: '/run#how',
  },
  {
    label: 'FAQs',
    link: '/faqs',
  },
  {
    label: 'Need Help?',
    link: 'mailto:politics@goodparty.org',
  },
];

export default function PortalLeftMenu({ id, role, pathname }) {
  const link = (itemLink) => `${itemLink}/${id}`;
  const user = getServerUser();
  return (
    <div className="px-3 pt-5 text-center lg:w-[220px] lg:overflow-x-hidden lg:pt-14 lg:pr-3 lg:pb-0 lg:pl-3 lg:text-left">
      {leftMenuItems.map((item) => (
        <Link
          href={link(item.link)}
          data-cy="portal-left-menu-item"
          key={item.label}
        >
          <div
            className="inline-block text-zinc-600 pr-5 pb-4 lg:block lg:pb-10 lg:pr-0"
            style={
              pathname === item.link
                ? { fontWeight: '900', color: 'black' }
                : {}
            }
          >
            {item.label}
          </div>
        </Link>
      ))}
      <div className="hidden lg:block">
        <div className="h-20">&nbsp;</div>
        {leftMenuItemsBottom.map((item) => (
          <Link href={item.link} key={item.label} passHref>
            <div className="inline-block text-zinc-600 pr-5 pb-4 lg:block lg:pb-10 lg:pr-0">
              {item.label}
            </div>
          </Link>
        ))}
        {user?.isAdmin && (
          <Link href={link('/candidate-portal/admin')}>
            <div
              className="inline-block text-zinc-600 pr-5 pb-4 lg:block lg:pb-10 lg:pr-0"
              style={
                pathname === '/candidate-portal/admin'
                  ? { fontWeight: '900', color: 'black' }
                  : {}
              }
            >
              Admin
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
