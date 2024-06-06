import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';
import CampaignStatisticsPage from './components/CampaignStatisticsPage';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';

const stripEmptyFilters = (filters) =>
  Object.keys(filters).reduce((acc, key) => {
    return {
      ...acc,
      ...(filters[key] !== undefined && filters[key] !== ''
        ? { [key]: filters[key] }
        : {}),
    };
  }, {});

const fetchCampaigns = async (filters) => {
  try {
    const api = gpApi.campaign.list;
    const token = getServerToken();

    return await gpFetch(api, filters, false, token, false);
  } catch (e) {
    console.log('error', e);
    return { campaigns: [] };
  }
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
    state,
    slug,
    level,
    primaryElectionDateStart,
    primaryElectionDateEnd,
    generalElectionDateStart,
    generalElectionDateEnd,
    campaignStatus,
    firehose,
  } = searchParams || {};

  const initialParams = {
    state,
    slug,
    level,
    primaryElectionDateStart,
    primaryElectionDateEnd,
    generalElectionDateStart,
    generalElectionDateEnd,
    campaignStatus,
    firehose,
  };
  const paramsAreEmpty = Object.values(initialParams).every(
    (val) => val === undefined || val === '',
  );
  let campaigns = [];
  if (!paramsAreEmpty || Boolean(firehose)) {
    campaigns = await fetchCampaigns(stripEmptyFilters(initialParams));
  }

  const childProps = {
    pathname: '/admin/campaign-statistics',
    title: 'Campaign Statistics',
    campaigns,
  };

  return <CampaignStatisticsPage {...childProps} />;
}
