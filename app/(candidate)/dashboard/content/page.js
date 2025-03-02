import { fetchContentByType } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import { camelToSentence } from 'helpers/stringHelper';
import candidateAccess from '../shared/candidateAccess';
import ContentPage from './components/ContentPage';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { getServerUser } from 'helpers/userServerHelper';
import { serverLoadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils';

const meta = pageMetaData({
  title: 'Campaign Content | GoodParty.org',
  description: 'Campaign Content',
  slug: '/dashboard/content',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const campaign = await fetchUserCampaign();

  const promptsRaw = await fetchContentByType('candidateContentPrompts', 3600);
  const prompts = parsePrompts(promptsRaw);

  const requiresQuestions = await fetchContentByType(
    'contentPromptsQuestions',
    3600,
  );

  const categories = await fetchContentByType('aiContentCategories', 3600);
  const candidatePositions = await serverLoadCandidatePosition(campaign.id);
  const user = await getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/content',
    campaign,
    prompts,
    templates: promptsRaw,
    categories,
    pathToVictory: campaign?.pathToVictory?.data,
    requiresQuestions,
    candidatePositions,
    user,
  };

  return <ContentPage {...childProps} />;
}

function parsePrompts(promptsRaw) {
  const keys = Object.keys(promptsRaw);
  const prompts = [];
  keys.forEach((key) => {
    prompts.push({
      key,
      title: camelToSentence(key),
    });
  });
  return prompts;
}
