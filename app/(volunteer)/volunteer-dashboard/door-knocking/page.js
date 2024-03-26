import pageMetaData from 'helpers/metadataHelper';
import VolunteerDoorKnocking from './components/VolunteerDoorKnocking';
import volunteerAccess from '../shared/volunteerAccess';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';

async function fetchRoutes(slug) {
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
  title: 'Door Knocking | GOOD PARTY',
  description: 'Volunteer Door Knocking',
  slug: '/volunteer-dashboard/door-knocking',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const campaigns = await volunteerAccess();
  console.log('campaigns', campaigns);
  const campaign = campaigns[0];
  const { unclaimedRoutes, claimedRoutes } = await fetchRoutes(campaign.slug);
  const childProps = {
    pathname: '/volunteer-dashboard/door-knocking',
    campaign,
    unclaimedRoutes,
    claimedRoutes,
  };

  console.log('childProps', childProps);

  return <VolunteerDoorKnocking {...childProps} />;
}
