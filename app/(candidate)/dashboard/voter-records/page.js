import { fetchUserCampaignOld } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import VoterRecordsPage from './components/VoterRecordsPage';
import { getServerUser } from 'helpers/userServerHelper';

const meta = pageMetaData({
  title: 'Voter Records | GOOD PARTY',
  description: 'Voter Records',
  slug: '/dashboard/voter-records',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaignOld();

  const childProps = {
    pathname: '/dashboard/funding',
    user,
    campaign,
  };

  return <VoterRecordsPage {...childProps} />;
}
