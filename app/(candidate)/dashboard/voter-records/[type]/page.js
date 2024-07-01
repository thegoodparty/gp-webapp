import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../../shared/candidateAccess';
import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import VoterFileDetailPage from './components.js/VoterFileDetailPage';
import { fetchCanDownload } from '../page';

const meta = pageMetaData({
  title: 'Voter Records detailed view | GoodParty.org',
  description: 'Voter Records detailed view',
  slug: '/dashboard/voter-records',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const { type } = params;
  await candidateAccess();

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaign();
  const canDownload = await fetchCanDownload();
  if (!canDownload) {
    redirect('/dashboard');
  }

  const childProps = {
    pathname: '/dashboard/voter-records',
    user,
    campaign,
    type,
  };

  return <VoterFileDetailPage {...childProps} />;
}
