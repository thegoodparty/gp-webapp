import Link from 'next/link';
import Image from 'next/image';

import MaxWidth from '../MaxWidth';
import NavRegister from './NavRegister';
import { getServerUser } from 'helpers/userServerHelper';
import UserAvatar from '@shared/user/UserAvatar';

export const HEADER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Candidates', href: '/candidates' },
];

export default function DesktopHeader() {
  const user = getServerUser();
  return (
    <div className="relative bg-white h-20 hidden lg:block border-solid border-b border-zinc-200 px-6 z-50">
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
                priority
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
                <div data-cy="header-link" className="mx-3 px-1 font-normal">
                  {link.label}
                </div>
              </Link>
            ))}
            {user?.name ? (
              <>
                <Link href="/profile" id="desktop-nav-profile">
                  <UserAvatar user={user} />
                </Link>
                {user?.isAdmin && (
                  <div className="shadow-md h-12 w-12 ml-4 flex justify-center items-center rounded-full">
                    <Link href="/admin">
                      <Image
                        src="/images/heart.svg"
                        width={30}
                        height={26}
                        alt="admin"
                        priority
                      />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <NavRegister />
            )}
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
