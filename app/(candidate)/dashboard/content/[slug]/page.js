import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { mapArticlesBySlug } from 'app/(candidate)/onboarding/[slug]/campaign-plan/page';
import { fetchCandidate } from 'app/candidate/[slug]/page';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import { camelToSentence } from 'helpers/stringHelper';
import candidateAccess from '../../shared/candidateAccess';
import EditContentPage from './components/EditContentPage';

// the idea is that slug and key will be different things.
// slug is obviously the url slug. it is in kebab case.
// so when im getting a key from a slug, it needs to be converted to camel case.

const meta = pageMetaData({
  title: 'Campaign Content | GOOD PARTY',
  description: 'Campaign Content',
  //   slug: '/dashboard/content',
});
export const metadata = meta;

export default async function Page({ params }) {
  const { slug } = params;
  await candidateAccess();

  const promptsRaw = (await fetchContentByKey('candidateContentPrompts'))
    .content;
  const prompts = parsePrompts(promptsRaw);

  const { campaign } = await fetchUserCampaign();

  const childProps = {
    slug,
    campaign,
    prompts,
  };

  return <EditContentPage {...childProps} />;
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
