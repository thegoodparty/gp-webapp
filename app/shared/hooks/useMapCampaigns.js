'use client';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const fetchCampaigns = async (filters) => {
  try {
    const api = gpApi.campaign.mapList;

    return await gpFetch(api, filters, 3600);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const useMapCampaigns = (filters) => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadCampaigns(filters);
  }, [filters]);

  const loadCampaigns = async (filters) => {
    const { campaigns } = await fetchCampaigns(filters);
    setCampaigns(campaigns || []);
  };

  return { campaigns };
};
