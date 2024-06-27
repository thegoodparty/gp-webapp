'use client';
import { createContext, useEffect, useState } from 'react';
import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus';

export const CampaignStatusContext = createContext([null, () => {}]);

export const CampaignStatusProvider = ({ children }) => {
  const [campaignStatus, setCampaignStatus] = useState(null);

  useEffect(() => {
    const getStatus = async () => {
      const status = await fetchCampaignStatus();
      // status.ok is a boolean on the 401 Response object sent back from gpFetch if the data fetch fails
      setCampaignStatus(status.ok === false ? null : status);
    };

    getStatus();
  }, []);

  return (
    <CampaignStatusContext.Provider value={[campaignStatus, setCampaignStatus]}>
      {children}
    </CampaignStatusContext.Provider>
  );
};
