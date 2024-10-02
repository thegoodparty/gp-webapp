import { adminAccessOnly } from 'helpers/permissionHelper';
import pageMetaData from 'helpers/metadataHelper';
import ProNoVoterPage from './components/ProNoVoterPage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { getServerToken } from 'helpers/userServerHelper';

async function fetchCampaignsNoVoter() {
  try {
    const api = gpApi.admin.proNoVoterFile;
    const autoToken = getServerToken();
    return await gpFetch(api, false, 10, autoToken);
  } catch (e) {
    return { campaigns: [] };
  }
}

const meta = pageMetaData({
  title: 'Pro users without voter file | GoodParty.org',
  description: 'Pro users without voter file',
  slug: '/admin/pro-no-voter-file',
});
export const metadata = meta;

export default async function Page() {
  await adminAccessOnly();

  const { campaigns } = await fetchCampaignsNoVoter();
  const childProps = { campaigns };
  return <ProNoVoterPage {...childProps} />;
}
