import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import QuestionsPage from './components/QuestionsPage';
import {
  fetchIssues,
  loadCandidatePosition,
} from 'app/(candidate)/dashboard/details/components/issues/issuesUtils';

const meta = pageMetaData({
  title: 'Additional Questions | GoodParty.org',
  description: 'Additional Questions',
  slug: '/dashboard/questions',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const { generate } = searchParams;

  const { campaign } = await fetchUserCampaign();
  const { candidatePositions } = await loadCandidatePosition(campaign.slug);
  const { topIssues } = await fetchIssues();

  const childProps = {
    campaign,
    generate,
    candidatePositions,
    topIssues,
  };

  return <QuestionsPage {...childProps} />;
}
