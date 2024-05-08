import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../../shared/candidateAccess';
import DoorKnockingMainPage from './components/DoorKnockingMainPage';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fetchDkCampaigns() {
  try {
    const api = gpApi.doorKnocking.list;

    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchDkCampaigns', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Door Knocking | GOOD PARTY',
  description: 'Door Knocking.',
  slug: '/dashboard/door-knocking/main',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const { dkCampaigns } = await fetchDkCampaigns();
  // if (dkCampaigns && dkCampaigns.length === 1) {
  //   redirect(`/dashboard/door-knocking/campaign/${dkCampaigns[0].slug}`);
  // }

  const childProps = {
    pathname: '/dashboard/door-knocking/main',
    user,
    campaign,
    dkCampaigns,
  };
  return <DoorKnockingMainPage {...childProps} />;
}
