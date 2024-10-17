import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminVictoryPathPage from './components/CandidateMetricsPage';
import pageMetaData from 'helpers/metadataHelper';

import { fetchCampaignBySlugAdminOnly } from 'app/admin/shared/fetchCampaignBySlugAdminOnly';

async function fetchAdminUpdateHistory(slug) {
  try {
    const api = gpApi.campaign.UpdateHistory.list;
    const payload = {
      slug,
    };
    const token = getServerToken();
    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error at fetchUpdateHistory', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Candidate Metrics | GoodParty.org',
  description: 'Admin Candidate Metrics',
  slug: '/admin/candidate-metrics',
});
export const metadata = meta;
export const maxDuration = 60;

export default async function Page({ params }) {
  await adminAccessOnly();
  const { slug } = params;
  const { campaign } = await fetchCampaignBySlugAdminOnly(slug);
  const { updateHistory } = await fetchAdminUpdateHistory(slug);

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Candidate Metrics',
    campaign,
    updateHistory,
  };
  return <AdminVictoryPathPage {...childProps} />;
}
