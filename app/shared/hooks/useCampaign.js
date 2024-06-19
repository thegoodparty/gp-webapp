import { useContext } from 'react';
import { CampaignContext } from '@shared/hooks/CampaignProvider';

export const useCampaign = () => {
  const [campaign, setCampaign, refreshCampaign] = useContext(CampaignContext);
  if (campaign === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return [campaign, setCampaign, refreshCampaign];
};
