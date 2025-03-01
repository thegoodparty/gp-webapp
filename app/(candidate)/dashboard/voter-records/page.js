import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import VoterRecordsPage from './components/VoterRecordsPage';
import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

export async function fetchCanDownload() {
  try {
    const resp = await serverFetch(apiRoutes.voters.voterFile.canDownload);
    return resp.data;
  } catch (e) {
    console.log('error at fetchCanDownload', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Voter Data | GoodParty.org',
  description: 'Voter Data',
  slug: '/dashboard/voter-records',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const user = await getServerUser(); // can be removed when door knocking app is not for admins only
  const campaign = await fetchUserCampaign();
  if (!campaign?.isPro) {
    return redirect('/dashboard/upgrade-to-pro', 'replace');
  }
  const canDownload = await fetchCanDownload();

  const childProps = {
    pathname: '/dashboard/voter-records',
    user,
    campaign,
    canDownload,
  };

  return <VoterRecordsPage {...childProps} />;
}
