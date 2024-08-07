'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import TopDashboardMenu from './TopDashboardMenu';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import NotificationsDropdown from './notifications/NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import DashboardOrContinue from './DashboardOrContinue';
import InfoButton from '@shared/buttons/InfoButton';
import { useUser } from '@shared/hooks/useUser';
import { ExitToDashboardButton } from '@shared/layouts/navigation/ExitToDashboardButton';

export default function RightSide() {
  const [user] = useUser();

  const [profileOpen, setProfileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const pathname = usePathname();
  const isDashboardPath =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/volunteer-dashboard');
  const isOnboardingPath = pathname?.startsWith('/onboarding');

  const toggleProfile = () => {
    closeAll();
    setProfileOpen(!profileOpen);
  };

  const toggleDashboard = () => {
    closeAll();
    setDashboardOpen(!dashboardOpen);
  };

  const closeAll = () => {
    setProfileOpen(false);
    document.body.style.overflow = 'visible';
  };

  if (isOnboardingPath) {
    return (
      <a
        href="/"
        id="nav-onboarding-finish-later"
        className="hidden lg:block relative z-[60]"
      >
        <InfoButton size="medium">Finish later</InfoButton>
      </a>
    );
  }

  return (
    <div className="hidden lg:flex justify-end items-center">
      {user ? (
        <>
          <ExitToDashboardButton />
          <NotificationsDropdown user={user} />
          <ProfileDropdown
            open={profileOpen}
            toggleCallback={toggleProfile}
            user={user}
          />
          <DashboardOrContinue
            isDashboardPath={isDashboardPath}
            closeAll={closeAll}
          />
          {isDashboardPath && (
            <TopDashboardMenu
              open={dashboardOpen}
              toggleCallback={toggleDashboard}
              pathname={pathname}
            />
          )}
        </>
      ) : (
        <>
          <Link href="/login" id="nav-sign-in" className="mr-6">
            <PrimaryButton variant="text" size="medium">
              <div className="font-medium text-base">Sign in</div>
            </PrimaryButton>
          </Link>
          <Link href="/run-for-office" id="nav-get-tools">
            <PrimaryButton size="medium">
              <div className="font-medium text-base">Get Campaign Tools</div>
            </PrimaryButton>
          </Link>
        </>
      )}
    </div>
  );
}
