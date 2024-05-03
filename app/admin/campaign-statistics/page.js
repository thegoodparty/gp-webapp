import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';
import CampaignStatisticsPage from './components/CampaignStatisticsPage';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';

const fetchCampaigns = async (filters) => {
  const api = gpApi.campaign.list;
  const token = getServerToken();
  const payload = { ...filters };
  console.log('payload', payload);
  return await gpFetch(api, payload, false, token);
};

const meta = pageMetaData({
  title: 'Campaign Statistics | GOOD PARTY',
  description: 'Admin Campaign Statistics.',
  slug: '/admin/campaign-statistics',
});
export const metadata = meta;

export default async function Page({ searchParams }) {
  adminAccessOnly();

  const {
    level,
    primaryElectionDateStart,
    primaryElectionDateEnd,
    generalElectionDateStart,
    generalElectionDateEnd,
    campaignStatus,
  } = searchParams || {};

  const initialParams = {
    level,
    primaryElectionDateStart,
    primaryElectionDateEnd,
    generalElectionDateStart,
    generalElectionDateEnd,
    campaignStatus,
  };
  const isEmptyParams = Object.values(initialParams).every(
    (val) => typeof val === 'undefined' || val === '',
  );
  let campaigns = [];
  if (!isEmptyParams) {
    ({ campaigns } = await fetchCampaigns(initialParams));
  }
  console.log('campaigns', campaigns);

  const childProps = {
    pathname: '/admin/campaign-statistics',
    title: 'Campaign Statistics',
    initialParams,
    isEmptyParams,
    campaigns,
  };

  return <CampaignStatisticsPage {...childProps} />;
}
