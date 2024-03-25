import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';
import VolunteerRoutePage from './components/VolunteerRoutePage';
import volunteerAccess from 'app/(volunteer)/volunteer-dashboard/shared/volunteerAccess';

async function fetchRoute(slug) {
  try {
    const api = gpApi.campaign.campaignVolunteer.routes.list;
    const token = getServerToken();
    const payload = {
      slug,
    };

    return await gpFetch(api, payload, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Volunteer Route | GOOD PARTY',
  description: 'Volunteer Route',
  slug: '/volunteer-dashboard/door-knocking/route',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const campaigns = await volunteerAccess();
  const { id } = params;

  const { route } = await fetchRoute(id);
  const childProps = {
    pathname: '/volunteer-dashboard/door-knocking',
    route,
  };

  return <VolunteerRoutePage {...childProps} />;
}
