'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LearnMore from './LearnMore';
import OfficeOrContinueLink from './OfficeOrContinueLink';
import RegisterOrProfile from './RegisterOrProfile';
import TopDashboardMenu from './TopDashboardMenu';

export async function fetchCampaignStatus() {
  try {
    const api = gpApi.user.campaignStatus;
    return await gpFetch(api, false, 10);
  } catch (e) {
    console.log('error at fetchCampaignVersions', e);
    return { status: false };
  }
}

export default function RightSideClient({ user }) {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState(false);

  const pathname = usePathname();
  const isDashboardPath = pathname.startsWith('/dashboard');

  useEffect(() => {
    updateStatus();
  }, []);
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
        user={user}
        campaignStatus={campaignStatus}
      />
      <OfficeOrContinueLink
        campaignStatus={campaignStatus}
        isDashboardPath={isDashboardPath}
      />
      <RegisterOrProfile
        user={user}
        open={accountOpen}
        toggleCallback={toggleAccount}
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
