import { fetchUserCampaignOld } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import ResourcesPage from './components/ResourcesPage';
import { getServerUser } from 'helpers/userServerHelper';

const meta = pageMetaData({
  title: 'Campaign Resources | GOOD PARTY',
  description: 'Campaign Resources',
  slug: '/dashboard/resources',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { content } = await fetchContentByKey('blogArticles');
  const articlesBySlug = mapArticlesBySlug(content);

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaignOld();

  const childProps = {
    pathname: '/dashboard/resources',
    articlesBySlug,
    user,
    campaign,
  };

  return <ResourcesPage {...childProps} />;
}

function mapArticlesBySlug(content = []) {
  let bySlug = {};
  content.forEach((article) => {
    bySlug[article.slug] = article;
  });
  return bySlug;
}
