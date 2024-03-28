import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';
import volunteerAccess from 'app/(volunteer)/volunteer-dashboard/shared/volunteerAccess';
import VolunteerAddressPage from './components/VolunteerAddressPage';
import { notFound } from 'next/navigation';

async function fetchVoter(id) {
  try {
    const api = gpApi.campaign.campaignVolunteer.voter.find;
    const token = getServerToken();
    const payload = {
      id,
    };

    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
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
  const { id, voterId } = params;

  const { voter } = await fetchVoter(voterId);
  if (!voter) {
    return notFound();
  }

  // const { route } = await fetchRoute(id);
  const childProps = {
    pathname: '/volunteer-dashboard/door-knocking',
    // route,
    voter,
  };

  return <VolunteerAddressPage {...childProps} />;
}
