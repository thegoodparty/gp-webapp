import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import VoterRecordsPage from './components/VoterRecordsPage';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { redirect } from 'next/navigation';

export async function fetchCanDownload() {
  try {
    const api = gpApi.voterData.canDownload;
    const token = getServerToken();
    return await gpFetch(api, false, false, token);
  } catch (e) {
    console.log('error at fetchCanDownload', e);
    return {};
  }
}

const meta = pageMetaData({
  title: 'Voter Records | GoodParty.org',
  description: 'Voter Records',
  slug: '/dashboard/voter-records',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaign();
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
