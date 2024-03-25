import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess';
import RoutePage from './components/RoutePage';

async function fetchDkRoute(slug, id) {
  try {
    const api = gpApi.doorKnocking.route.find;
    const payload = {
      slug,
      id,
    };
    const token = getServerToken();
    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error at fetchDkCampaign', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Door Knocking Route | GOOD PARTY',
  description: 'Door Knocking Route',
  slug: '/dashboard/door-knocking/campaign/[slug]/route',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const { slug, id } = params;

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { dkCampaign, route } = await fetchDkRoute(slug, id);
  const { campaign } = await fetchUserCampaign();

  console.log('route', route);

  const childProps = {
    user,
    dkCampaign,
    route,
    campaign,
  };
  return <RoutePage {...childProps} />;
}
