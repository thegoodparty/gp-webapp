'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavDropdowns } from '@shared/layouts/navigation/NavDropdowns';

export default function LeftSide() {
  const pathname = usePathname();
  const isOnboardingPath =
    pathname?.startsWith('/onboarding') || pathname === '/sign-up/account-type';

  const isDashboardPath =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/volunteer-dashboard');

  if (isOnboardingPath || isDashboardPath) {
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
