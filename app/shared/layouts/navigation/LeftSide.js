'use client';

import { usePathname } from 'next/navigation';
import { NavDropdowns } from '@shared/layouts/navigation/NavDropdowns';
import { useMemo } from 'react';
import NavButton from './NavButton';

// list of paths to hide marketing nav
const HIDE_NAV_PATHS = [
  '/onboarding',
  '/dashboard',
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
      <NavButton href="/about" id="nav-mission" className="lg:ml-3 xl:ml-6">
        <span className="font-medium text-base" data-testid="nav-our-mission">
          Our Mission
        </span>
      </NavButton>
    </div>
  );
}
