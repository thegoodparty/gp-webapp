import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminVictoryPathPage from './components/AdminVictoryPathPage';
import pageMetaData from 'helpers/metadataHelper';

export async function fetchCampaignBySlug(slug) {
  // admin only
  try {
    const api = gpApi.campaign.onboarding.findBySlug;
    const payload = {
      slug,
    };
    const token = getServerToken();
    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Admin Path to Victory | GOOD PARTY',
  description: 'Admin Path to Victory.',
  slug: '/admin/victory-path',
});
export const metadata = meta;

// const fetchOnboardings = async () => {
//   const api = gpApi.campaign.onboarding.list;
//   const token = getServerToken();
//   return await gpFetch(api, false, false, token);
// };

export default async function Page({ params }) {
  adminAccessOnly();
  const { slug } = params;
  const { campaign } = await fetchCampaignBySlug(slug);

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Path to Victory',
    campaign,
  };
  return <AdminVictoryPathPage {...childProps} />;
}
