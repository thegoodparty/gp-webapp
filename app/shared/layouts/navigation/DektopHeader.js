import { useContext } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import MaxWidth from '../MaxWidth';
import { getUserCookie } from '/helpers/cookieHelper';
import { AppContext } from '../PageWrapper';

export const HEADER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Candidates', href: '/candidates' },
];

export default function DesktopHeader() {
  const { user } = useContext(AppContext);

  return (
    <div className="relative bg-white  hidden lg:block border-solid border-b border-zinc-200 px-6 z-50">
      <MaxWidth>
        <div className="flex justify-between items-center h-20">
          <div>
            <Link href="/" id="desktop-nav-logo">
              <Image
                src="/images/black-logo.svg"
                data-cy="logo"
                width={174}
                height={20}
                alt="GOOD PARTY"
              />
            </Link>
          </div>
          <div className="flex justify-end items-center">
            {HEADER_LINKS.map((link) => (
              <Link
                href={link.href}
                data-cy="header-link-label"
                id={`desktop-nav-${link.label.replace(' ', '-')}`}
                key={link.href}
              >
                <div data-cy="header-link" className="mx-3 px-1">
                  {link.label}
                </div>
              </Link>
            ))}
            {user?.name ? (
              <Link href="/profile" id="desktop-nav-profile">
                Profile
              </Link>
            ) : (
              <Link
                href={`/?register=true`}
                data-cy="header-register"
                id="desktop-nav-register"
              >
                <strong className="mx-3 px-1">Join Us</strong>
              </Link>
            )}
            {user?.isAdmin && (
              <div className="shadow-md h-10 w-10 flex justify-center items-center rounded-full">
                <Link href="/admin">
                  <Image
                    src="/images/heart.svg"
                    width={30}
                    height={26}
                    alt="admin"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
