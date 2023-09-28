import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import { camelToSentence } from 'helpers/stringHelper';
import candidateAccess from '../../shared/candidateAccess';
import EditContentPage from './components/EditContentPage';

// slug = kebab case.
// key = camel case

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
