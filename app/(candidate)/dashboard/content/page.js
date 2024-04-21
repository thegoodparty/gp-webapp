// import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import { camelToSentence } from 'helpers/stringHelper';
import candidateAccess from '../shared/candidateAccess';
import ContentPage from './components/ContentPage';
import { fetchUserCampaignOld } from 'app/(candidate)/onboarding/shared/getCampaign';
import { loadCandidatePosition } from '../questions/page';
import { getServerUser } from 'helpers/userServerHelper';

const meta = pageMetaData({
  title: 'Campaign Content | GOOD PARTY',
  description: 'Campaign Content',
  slug: '/dashboard/content',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const { campaign } = await fetchUserCampaignOld();

  const promptsRaw = (await fetchContentByKey('candidateContentPrompts', 3600))
    .content;
  const prompts = parsePrompts(promptsRaw);

  const requiresQuestions = (
    await fetchContentByKey('contentPromptsQuestions', 3600)
  ).content;

  const categories = (await fetchContentByKey('aiContentCategories', 3600))
    .content;

  const { candidatePositions } = await loadCandidatePosition(campaign.slug);
  const user = getServerUser(); // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/content',
    campaign,
    prompts,
    templates: promptsRaw,
    categories,
    pathToVictory: campaign?.pathToVictory,
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
