import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminVictoryPathPage from './components/AdminVictoryPathPage';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Admin Path to Victory | GOOD PARTY',
  description: 'Admin Path to Victory.',
  slug: '/admin/victory-path',
});
export const metadata = meta;

const fetchOnboardings = async () => {
  const api = gpApi.campaign.onboarding.list;
  console.log(api);
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const res = await fetchOnboardings();
  const { campaigns } = res;

  const childProps = {
    pathname: '/admin/victory-path',
    title: 'Path to Victory',
    campaigns,
  };
  return <AdminVictoryPathPage {...childProps} />;
}
