import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../../shared/candidateAccess';
import { getServerUser } from 'helpers/userServerHelper';
import { redirect } from 'next/navigation';
import VoterFileDetailPage from 'app/(candidate)/dashboard/voter-records/[type]/components/VoterFileDetailPage';
import { fetchCanDownload } from '../page';
import { fetchContentByKey } from 'helpers/fetchHelper';
import { setRequiresQuestionsOnTemplates } from 'helpers/setRequiresQuestionsOnTemplates';
import { loadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils';
import { calcAnswers } from 'app/(candidate)/dashboard/plan/components/QuestionProgress';

const meta = pageMetaData({
  title: 'Voter Data detailed view | GoodParty.org',
  description: 'Voter Data detailed view',
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

  const { candidatePositions } = await loadCandidatePosition(campaign.slug);

  const { answeredQuestions, totalQuestions } = calcAnswers(
    campaign,
    candidatePositions,
  );

  const hasCompletedQuestions = answeredQuestions >= totalQuestions;

  // TODO: Find out why in the world aren't these booleans just being passed along from the entity in Contentful.
  const requiresQuestions = !hasCompletedQuestions
    ? (await fetchContentByKey('contentPromptsQuestions', 3600))?.content
    : {};

  const categories = (
    await fetchContentByKey('aiContentCategories', 3600)
  )?.content?.map((category = {}) => ({
    ...category,
    templates: setRequiresQuestionsOnTemplates(
      category.templates,
      requiresQuestions,
    ),
  }));

  const isCustom = type.startsWith('custom-');

  const childProps = {
    pathname: '/dashboard/voter-records',
    user,
    campaign,
    type,
    isCustom,
    categories,
  };

  return <VoterFileDetailPage {...childProps} />;
}
