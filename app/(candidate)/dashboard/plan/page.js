import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from 'app/candidate/[slug]/page';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignPlanPage from './components/CampaignPlanPage';

const meta = pageMetaData({
  title: 'Campaign Plan | GOOD PARTY',
  description: 'Campaign Plan',
  slug: '/dashboard/plan',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;
  const { candidate } = await fetchCandidate(candidateSlug);

  const childProps = {
    pathname: '/dashboard/plan',
    campaign,
    candidate,
    candidateSlug,
    pathToVictory: campaign?.pathToVictory,
  };

  return <CampaignPlanPage {...childProps} />;
}
