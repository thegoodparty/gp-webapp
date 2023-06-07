import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { mapArticlesBySlug } from 'app/(candidate)/onboarding/[slug]/campaign-plan/page';
import { fetchCandidate } from 'app/candidate/[slug]/page';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
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

  const { content } = await fetchContentByKey('blogArticles');
  const articlesBySlug = mapArticlesBySlug(content);

  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;
  // const { candidate } = await fetchCandidate(candidateSlug);

  const childProps = {
    pathname: '/dashboard/content',
    articlesBySlug,
    campaign,
    candidateSlug,
  };

  return <ContentPage {...childProps} />;
}
