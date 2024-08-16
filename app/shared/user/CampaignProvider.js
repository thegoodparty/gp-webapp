'use client';
import { createContext, useEffect, useState } from 'react';
import { fetchUserClientCampaign } from 'helpers/fetchUserClientCampaign';

export const CampaignContext = createContext([null, () => {}]);

export const CampaignProvider = ({ children }) => {
  const [campaign, setCampaign] = useState(null);

  const refreshCampaign = async () => {
    const { campaign } = await fetchUserClientCampaign();
    setCampaign(campaign.ok === false ? null : campaign);
  };

  useEffect(() => {
    const getCampaign = async () => {
      const { campaign } = await fetchUserClientCampaign();
      setCampaign(campaign.ok === false ? null : campaign);
    };

    getCampaign();
  }, []);

  return (
    <CampaignContext.Provider value={[campaign, setCampaign, refreshCampaign]}>
      {children}
    </CampaignContext.Provider>
  );
};
