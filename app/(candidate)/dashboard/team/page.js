import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from 'app/candidate/[slug]/page';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import CampaignTeamPage from './components/CampaignTeamPage';

const meta = pageMetaData({
  title: 'Campaign Team | GOOD PARTY',
  description: 'Campaign Team',
  slug: '/dashboard/team',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;
  // const { candidate } = await fetchCandidate(candidateSlug);

  const childProps = {
    pathname: '/dashboard/team',
    candidateSlug,
    pathToVictory: campaign?.pathToVictory,
  };

  return <CampaignTeamPage {...childProps} />;
}
