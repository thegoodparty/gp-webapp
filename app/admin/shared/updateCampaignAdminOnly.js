'use client';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

export async function updateCampaignAdminOnly(payload) {
  try {
    const resp = await clientFetch(apiRoutes.admin.campaign.update, payload);
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}
