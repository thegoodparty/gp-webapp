import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { getServerToken } from 'helpers/userServerHelper';
import AdminVictoryPathPage from './components/AdminVictoryPathPage';

const fetchOnboardings = async () => {
  const api = gpApi.campaign.onboarding.list;
  console.log(api);
  const token = getServerToken();
  return await gpFetch(api, false, false, token);
};

export default async function Page() {
  adminAccessOnly();
  const res = await fetchOnboardings();
  console.log('res', res);
  const { campaigns } = res;
  console.log('cc', campaigns);

  const childProps = {
    pathname: '/admin/victory-path',
    title: 'Path to Victory',
    campaigns,
  };
  return <AdminVictoryPathPage {...childProps} />;
}
