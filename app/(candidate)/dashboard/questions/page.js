import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import QuestionsPage from './components/QuestionsPage';
import {
  serverFetchIssues,
  serverLoadCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils';

const meta = pageMetaData({
  title: 'Additional Questions | GoodParty.org',
  description: 'Additional Questions',
  slug: '/dashboard/questions',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const { generate } = searchParams;

  const campaign = await fetchUserCampaign();
  const candidatePositions = await serverLoadCandidatePosition(campaign.id);
  const topIssues = await serverFetchIssues();

  const childProps = {
    campaign,
    generate,
    candidatePositions,
    topIssues,
  };

  return <QuestionsPage {...childProps} />;
}
