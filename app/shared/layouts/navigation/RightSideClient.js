'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import LearnMore from './LearnMore';
import OfficeOrContinueLink from './OfficeOrContinueLink';
import RegisterOrProfile from './RegisterOrProfile';

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
  const [campaignStatus, setCampaignStatus] = useState(false);

  useEffect(() => {
    updateStatus();
  }, []);
  const updateStatus = async () => {
    const status = await fetchCampaignStatus();
    setCampaignStatus(status);
  };

  const toggleLearnMore = () => {
    setAccountOpen(false);
    setLearnMoreOpen(!learnMoreOpen);
  };

  const toggleAccount = () => {
    setLearnMoreOpen(false);
    setAccountOpen(!accountOpen);
  };
  return (
    <>
      <LearnMore
        open={learnMoreOpen}
        toggleCallback={toggleLearnMore}
        user={user}
        campaignStatus={campaignStatus}
      />
      <OfficeOrContinueLink campaignStatus={campaignStatus} />
      <RegisterOrProfile
        user={user}
        open={accountOpen}
        toggleCallback={toggleAccount}
      />
    </>
  );
}
