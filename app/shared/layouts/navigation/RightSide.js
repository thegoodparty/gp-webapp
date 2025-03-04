'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import TopDashboardMenu from './TopDashboardMenu';
import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';
import DashboardOrContinue from './DashboardOrContinue';
import { useUser } from '@shared/hooks/useUser';
import { ExitToDashboardButton } from '@shared/layouts/navigation/ExitToDashboardButton';
import FullStorySelectiveInit from './FullStorySelectiveInit';
import NavButton from './NavButton';
import Button from '@shared/buttons/Button';
import { USER_ROLES, userHasRole } from 'helpers/userHelper';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

export default function RightSide() {
  const [user] = useUser();

  const [profileOpen, setProfileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const pathname = usePathname();
  const isDashboardPath = pathname?.startsWith('/dashboard');
  const isOnboardingPath = pathname?.startsWith('/onboarding');
  const isServePath = pathname?.startsWith('/serve');

  const toggleProfile = () => {
    if (profileOpen) {
      trackEvent(EVENTS.Navigation.Top.AvatarDropdown.CloseDropdown);
    }
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
      <Button
        href="/"
        onClick={() =>
          trackEvent(EVENTS.Onboarding.ClickFinishLater, {
            pathname: pathname,
          })
        }
        id="nav-onboarding-finish-later"
        className="hidden lg:block relative z-[60] font-medium !text-base !py-2"
        variant="text"
      >
        Finish Later
      </Button>
    );
  }

  return (
    <div className="hidden lg:flex justify-end items-center">
      {user ? (
        <>
          <ExitToDashboardButton />
          <ProfileDropdown
            open={profileOpen}
            toggleCallback={toggleProfile}
            user={user}
            isServePath={isServePath}
          />
          {!userHasRole(user, USER_ROLES.SALES) &&
            (isDashboardPath ? (
              <TopDashboardMenu
                open={dashboardOpen}
                toggleCallback={toggleDashboard}
                pathname={pathname}
              />
            ) : (
              <DashboardOrContinue
                isDashboardPath={isDashboardPath}
                closeAll={closeAll}
                isServePath={isServePath}
              />
            ))}
        </>
      ) : (
        <>
          <Link href="/login" id="nav-login" className="lg:mr-3 xl:mr-6">
            <div className="font-medium text-base" data-testid="nav-login">
              Login
            </div>
          </Link>
          <NavButton
            href="/sign-up"
            id="nav-sign-up"
            className="lg:mr-3 xl:mr-6"
            data-testid="nav-sign-up"
          >
            <span className="font-medium text-base">Sign up</span>
          </NavButton>
          <Button
            href="/run-for-office"
            id="nav-get-tools"
            className="!py-2 border-none"
            data-testid="nav-get-tools"
          >
            <span className="font-medium text-base">Get Campaign Tools</span>
          </Button>
        </>
      )}
      <FullStorySelectiveInit user={user} />
    </div>
  );
}
