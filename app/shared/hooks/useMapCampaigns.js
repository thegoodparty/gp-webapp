'use client';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const fetchCampaigns = async (filters) => {
  try {
    const api = gpApi.campaign.mapList;
    if (
      filters &&
      (filters.neLat === '' ||
        filters.swLat === '' ||
        filters.neLat === false ||
        filters.swLat === false)
    ) {
      delete filters.neLat;
      delete filters.neLng;
      delete filters.swLat;
      delete filters.swLng;
    }
    return await gpFetch(api, filters, 3600);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const useMapCampaigns = (filters) => {
  const [campaigns, setCampaigns] = useState([]);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false);

  useEffect(() => {
    const isFilterEmpty =
      !filters || Object.values(filters).every((val) => !val);
    setIsCampaignsLoading(true);
    loadCampaigns(isFilterEmpty ? null : filters);
  }, [filters]);

  async function loadCampaigns(filters) {
    const { campaigns } = await fetchCampaigns(filters);
    setCampaigns(campaigns || []);
    setIsCampaignsLoading(false);
  }

  return { campaigns, isCampaignsLoading, setIsCampaignsLoading };
};
