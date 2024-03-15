import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../../../shared/candidateAccess';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import DkCampaignPage from './components/DkCampaignPage';

async function fetchDkCampaign(slug) {
  try {
    const api = gpApi.doorKnocking.get;
    const payload = {
      slug,
    };
    const token = getServerToken();
    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error at fetchDkCampaign', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Door Knocking Campaign | GOOD PARTY',
  description: 'Door Knocking Campaign',
  slug: '/dashboard/door-knocking/campaign/[slug]',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const { slug } = params;

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { dkCampaign } = await fetchDkCampaign(slug);

  const childProps = {
    user,
    dkCampaign,
  };
  return <DkCampaignPage {...childProps} />;
}
