import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from 'app/candidate/[slug]/page';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignFundingPage from './components/CampaignFundingPage';

const meta = pageMetaData({
  title: 'Campaign Funding | GOOD PARTY',
  description: 'Campaign Funding',
  slug: '/dashboard/funding',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  // const { campaign } = await fetchUserCampaign();
  // const { candidateSlug } = campaign;
  // const { candidate } = await fetchCandidate(candidateSlug);

  const childProps = {
    pathname: '/dashboard/funding',
  };

  return <CampaignFundingPage {...childProps} />;
}
