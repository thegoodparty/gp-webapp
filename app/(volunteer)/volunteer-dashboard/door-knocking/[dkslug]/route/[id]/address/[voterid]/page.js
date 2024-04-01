import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';
import volunteerAccess from 'app/(volunteer)/volunteer-dashboard/shared/volunteerAccess';
import VolunteerAddressPage from './components/VolunteerAddressPage';
import { notFound } from 'next/navigation';

async function fetchVoter(id, dkSlug) {
  try {
    const api = gpApi.campaign.campaignVolunteer.voter.find;
    const token = getServerToken();
    const payload = {
      id,
      dkSlug,
    };

    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return false;
  }
}

async function fetchSurvey(routeId, voterId) {
  try {
    const api = gpApi.doorKnocking.survey.find;
    const token = getServerToken();
    const payload = {
      routeId,
      voterId,
    };

    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Volunteer Route - address | GOOD PARTY',
  description: 'Volunteer Route- address.',
  slug: '/volunteer-dashboard/door-knocking/route',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const campaigns = await volunteerAccess();
  const { id, voterid, dkslug } = params;

  const { voter } = await fetchVoter(voterid, dkslug);
  if (!voter) {
    return notFound();
  }
  const { survey } = await fetchSurvey(id, voterid);

  // const { route } = await fetchRoute(id);
  const childProps = {
    pathname: '/volunteer-dashboard/door-knocking',
    // route,
    voter,
    dkSlug: dkslug,
    routeId: id,
    survey,
  };

  return <VolunteerAddressPage {...childProps} />;
}
