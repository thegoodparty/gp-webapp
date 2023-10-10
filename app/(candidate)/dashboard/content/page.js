// import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import { camelToSentence } from 'helpers/stringHelper';
import candidateAccess from '../shared/candidateAccess';
import ContentPage from './components/ContentPage';

const meta = pageMetaData({
  title: 'Campaign Content | GOOD PARTY',
  description: 'Campaign Content',
  slug: '/dashboard/content',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const promptsRaw = (await fetchContentByKey('candidateContentPrompts'))
    .content;
  const prompts = parsePrompts(promptsRaw);

  const templates = (await fetchContentByKey('candidateContentPrompts'))
    .content;

  const categories = (await fetchContentByKey('aiContentCategories')).content;

  const childProps = {
    pathname: '/dashboard/content',
    // campaign,
    prompts,
    templates,
    categories,
    pathToVictory: campaign?.pathToVictory,
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
