'use client';
import { useContext } from 'react';
import { CampaignContext } from '@shared/user/CampaignProvider';

export const useCampaign = () => useContext(CampaignContext);
