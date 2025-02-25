import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export async function serverLoadCandidatePosition(campaignId) {
  try {
    const payload = {
      id: campaignId,
    };
    const resp = await serverFetch(
      apiRoutes.campaign.campaignPosition.find,
      payload,
    );
    return resp.data || [];
  } catch (e) {
    console.log('error at serverLoadCandidatePosition', e);
    return false;
  }
}

export const serverFetchIssues = async () => {
  const resp = await serverFetch(apiRoutes.topIssue.list, undefined, {
    revalidate: 3600,
  });
  return resp.data || [];
};
