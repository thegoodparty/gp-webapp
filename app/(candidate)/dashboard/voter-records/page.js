import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import VoterRecordsPage from './components/VoterRecordsPage';
import { getServerUser } from 'helpers/userServerHelper';

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

  const childProps = {
    pathname: '/dashboard/voter-records',
    user,
    campaign,
  };

  return <VoterRecordsPage {...childProps} />;
}
