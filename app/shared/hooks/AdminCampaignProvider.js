'use client';
import { createContext, useState } from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';

export const AdminCampaignContext = createContext([{}, () => {}]);

export const AdminCampaignProvider = ({ children, campaign: initCampaign }) => {
  const [campaign, setCampaign] = useState(initCampaign);
  const refreshCampaign = async () => {
    const { campaign: refreshedCampaign } = await gpFetch(
      gpApi.campaign.findBySlug,
      {
        slug: campaign.slug,
      },
    );
    setCampaign(refreshedCampaign);
  };

  return (
    <AdminCampaignContext.Provider
      value={[campaign, setCampaign, refreshCampaign]}
    >
      {children}
    </AdminCampaignContext.Provider>
  );
};
