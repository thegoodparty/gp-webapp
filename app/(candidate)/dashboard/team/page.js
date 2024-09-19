import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignTeamPage from './components/CampaignTeamPage';
import gpApi from 'gpApi';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';

async function loadVolunteers() {
  try {
    const api = gpApi.campaign.campaignVolunteer.list;

    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at loadVolunteers', e);
    return {};
  }
}

async function loadInvitations() {
  try {
    const api = gpApi.campaign.volunteerInvitation.list;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

async function getCampaignRequests() {
  try {
    const token = getServerToken();
    return await gpFetch(
      gpApi.campaign.campaignRequests.list,
      false,
      false,
      token,
    );
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Campaign Team | GoodParty.org',
  description: 'Campaign Team',
  slug: '/dashboard/team',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;
  const { volunteers } = await loadVolunteers();
  const { invitations } = await loadInvitations();
  const requests = await getCampaignRequests();
  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/team',
    candidateSlug,
    pathToVictory: campaign?.pathToVictory,
    volunteers,
    invitations,
    requests,
    user,
    campaign,
  };

  return <CampaignTeamPage {...childProps} />;
}
