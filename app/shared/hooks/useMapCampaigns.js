'use client';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const fetchCampaigns = async () => {
  try {
    const api = gpApi.campaign.mapList;

    return await gpFetch(api, false, 3600);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const useMapCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const { campaigns } = await fetchCampaigns();
    setCampaigns(campaigns);
  };

  return { campaigns };
};
