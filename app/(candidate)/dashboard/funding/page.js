import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignFundingPage from './components/CampaignFundingPage';
import { getServerUser } from 'helpers/userServerHelper';

const meta = pageMetaData({
  title: 'Campaign Funding | GoodParty.org',
  description: 'Campaign Funding',
  slug: '/dashboard/funding',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaign();

  const childProps = {
    pathname: '/dashboard/funding',
    user,
    campaign,
  };

  return <CampaignFundingPage {...childProps} />;
}
