import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';
import VolunteerRoutePage from './components/VolunteerRoutePage';
import volunteerAccess from 'app/(volunteer)/volunteer-dashboard/shared/volunteerAccess';
import { notFound } from 'next/navigation';

async function fetchRoute(id, dkSlug) {
  try {
    const api = gpApi.campaign.campaignVolunteer.routes.find;
    const token = getServerToken();
    const payload = {
      id,
      dkSlug,
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
  const { id, dkslug } = params;

  const { route } = await fetchRoute(id, dkslug);
  if (!route) {
    notFound();
  }
  const childProps = {
    pathname: '/volunteer-dashboard/door-knocking',
    route,
    dkSlug: dkslug,
  };

  return <VolunteerRoutePage {...childProps} />;
}
