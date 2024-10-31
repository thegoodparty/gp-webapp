import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';
import CampaignStatisticsPage from './components/CampaignStatisticsPage';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';
import { pick } from 'helpers/objectHelper';

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
  title: 'Campaign | GOOD PARTY',
  description: 'Admin Campaign.',
  slug: '/admin/campaign-statistics',
});
export const metadata = meta;
export const maxDuration = 60;

export default async function Page({ searchParams = {} }) {
  await adminAccessOnly();

  const initialParams = pick(searchParams, [
    'id',
    'state',
    'slug',
    'email',
    'level',
    'primaryElectionDateStart',
    'primaryElectionDateEnd',
    'generalElectionDateStart',
    'generalElectionDateEnd',
    'campaignStatus',
    'p2vStatus',
    'firehose',
  ]);
  const firehose = initialParams.fireHose;

  const paramsAreEmpty = Object.values(initialParams).every(
    (val) => val === undefined || val === '',
  );
  let campaigns = [];
  let withParams = false;
  if (!paramsAreEmpty && !Boolean(firehose)) {
    withParams = true;
    ({ campaigns } = await fetchCampaigns(stripEmptyFilters(initialParams)));
  }

  const childProps = {
    pathname: '/admin/campaign-statistics',
    title: 'Campaigns',
    campaigns,
    fireHose: Boolean(firehose) && !withParams,
  };

  return <CampaignStatisticsPage {...childProps} />;
}
