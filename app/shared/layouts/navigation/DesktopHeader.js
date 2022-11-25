import Link from 'next/link';
import Image from 'next/image';

import MaxWidth from '../MaxWidth';
import NavRegisterOrProfile from './NavRegisterOrProfile';

export const HEADER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Candidates', href: '/candidates' },
];

export default function DesktopHeader() {
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
            <NavRegisterOrProfile />
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
