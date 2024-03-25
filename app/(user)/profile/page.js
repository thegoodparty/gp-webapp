import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import pageMetaData from 'helpers/metadataHelper';
import ProfilePage from './components/ProfilePage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fetchInvitations() {
  try {
    const api = gpApi.campaign.volunteerInvitation.listByUser;
    const token = getServerToken();

    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Profile Settings',
  description: 'Profile settings for Good Party.',
});
export const metadata = meta;

export default async function Page() {
  const user = getServerUser();
  if (!user) {
    redirect('/login');
  }

  const { invitations } = await fetchInvitations();
  const childProps = { invitations, user };
  return <ProfilePage {...childProps} />;
}
