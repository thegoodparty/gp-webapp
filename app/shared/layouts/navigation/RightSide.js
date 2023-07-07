'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getUserCookie } from 'helpers/cookieHelper';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import GetInvolved from './GetInvolved';
import LearnMore from './LearnMore';
import OfficeOrContinueLink from './OfficeOrContinueLink';
import RegisterOrProfile from './RegisterOrProfile';
import TopDashboardMenu from './TopDashboardMenu';

export async function fetchCampaignStatus() {
  try {
    const api = gpApi.user.campaignStatus;
    return await gpFetch(api, false, 10);
  } catch (e) {
    return { status: false };
  }
}

export default function RightSideClient() {
  const [user, setUser] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState(false);

  useEffect(() => {
    const cookieUser = getUserCookie(true);
    setUser(cookieUser);
    if (cookieUser) {
      updateStatus();
    }
  }, []);

  const pathname = usePathname();
  const isDashboardPath = pathname.startsWith('/dashboard');

  const updateStatus = async () => {
    const status = await fetchCampaignStatus();
    setCampaignStatus(status);
  };

  const closeAll = () => {
    setAccountOpen(false);
    setLearnMoreOpen(false);
    setDashboardOpen(false);
  };

  const toggleLearnMore = () => {
    closeAll();
    setLearnMoreOpen(!learnMoreOpen);
  };

  const toggleAccount = () => {
    closeAll();
    setAccountOpen(!accountOpen);
  };
  const toggleDashboard = () => {
    closeAll();
    setDashboardOpen(!dashboardOpen);
  };
  return (
    <>
      <LearnMore
        open={learnMoreOpen}
        toggleCallback={toggleLearnMore}
        campaignStatus={campaignStatus}
        closeAll={closeAll}
      />

      <OfficeOrContinueLink
        campaignStatus={campaignStatus}
        isDashboardPath={isDashboardPath}
        closeAll={closeAll}
      />

      <GetInvolved
        toggleCallback={toggleLearnMore}
        user={user}
        campaignStatus={campaignStatus}
        closeAll={closeAll}
      />

      <RegisterOrProfile
        user={user}
        open={accountOpen}
        toggleCallback={toggleAccount}
        campaignStatus={campaignStatus}
      />
      {isDashboardPath && (
        <TopDashboardMenu
          open={dashboardOpen}
          toggleCallback={toggleDashboard}
          pathname={pathname}
        />
      )}
    </>
  );
}
