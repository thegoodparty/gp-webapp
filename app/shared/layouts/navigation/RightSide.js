'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie } from 'helpers/cookieHelper';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import TopDashboardMenu from './TopDashboardMenu';
import Link from 'next/link';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import NotificationsDropdown from './notifications/NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';
import DashboardOrContinue from './DashboardOrContinue';
import InfoButton from '@shared/buttons/InfoButton';

export async function fetchCampaignStatus() {
  try {
    const api = gpApi.user.campaignStatus;
    return await gpFetch(api, false, 10);
  } catch (e) {
    return { status: false };
  }
}

export default function RightSide() {
  const [user, setUser] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    const cookieUser = getUserCookie(true);
    setUser(cookieUser);
    if (cookieUser) {
      updateStatus();
    }
  }, []);

  const pathname = usePathname();
  const isDashboardPath =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/volunteer-dashboard');
  const isOnboardingPath = pathname?.startsWith('/onboarding');

  const updateStatus = async () => {
    const status = await fetchCampaignStatus();
    setCampaignStatus(status);
  };

  const toggleNotifications = () => {
    closeAll();
    if (!notificationsOpen) {
      document.body.style.overflow = 'hidden';
    }
    setNotificationsOpen(!notificationsOpen);
  };

  const toggleProfile = () => {
    closeAll();
    setProfileOpen(!profileOpen);
  };

  const toggleDashboard = () => {
    closeAll();
    setDashboardOpen(!dashboardOpen);
  };

  const closeAll = () => {
    setNotificationsOpen(false);
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
          <NotificationsDropdown
            open={notificationsOpen}
            toggleCallback={toggleNotifications}
            user={user}
          />
          <ProfileDropdown
            open={profileOpen}
            toggleCallback={toggleProfile}
            user={user}
          />
          <DashboardOrContinue
            campaignStatus={campaignStatus}
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
