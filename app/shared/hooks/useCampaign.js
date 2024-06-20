import { useContext } from 'react';
import { CampaignContext } from '@shared/hooks/AdminCampaignProvider';

export const useCampaign = () => {
  const [campaign, setCampaign, refreshCampaign] = useContext(CampaignContext);
  if (campaign === undefined) {
    throw new Error('useCampaign must be used within a AdminCampaignProvider');
  }
  return [campaign, setCampaign, refreshCampaign];
};
