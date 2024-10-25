'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavDropdowns } from '@shared/layouts/navigation/NavDropdowns';
import { useMemo } from 'react';

// list of paths to hide marketing nav
const HIDE_NAV_PATHS = [
  '/onboarding',
  '/dashboard',
  '/volunteer-dashboard',
  '/profile',
];

export default function LeftSide() {
  const pathname = usePathname();
  const shouldHideNav = useMemo(
    () => HIDE_NAV_PATHS.some((path) => pathname?.startsWith(path)),
    [pathname],
  );

  if (shouldHideNav) {
    return null;
  }

  return (
    <div className="items-center hidden lg:flex">
      <NavDropdowns />
      <Link href="/about" id="nav-mission" className="lg:ml-3 xl:ml-6">
        <PrimaryButton variant="text" size="medium">
          <div className="font-medium text-base">Our Mission</div>
        </PrimaryButton>
      </Link>
    </div>
  );
}
