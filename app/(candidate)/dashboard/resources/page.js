import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchContentByKey } from 'helpers/fetchHelper';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import ResourcesPage from './components/ResourcesPage';
import { getServerUser } from 'helpers/userServerHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fetchArticlesBySlug() {
  const api = gpApi.content.articlesBySlug;

  return await gpFetch(api, false, 7200);
}

const meta = pageMetaData({
  title: 'Campaign Resources | GoodParty.org',
  description: 'Campaign Resources',
  slug: '/dashboard/resources',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { articles: articlesBySlug } = await fetchArticlesBySlug(
    'blogArticles',
  );

  const user = getServerUser(); // can be removed when door knocking app is not for admins only
  const { campaign } = await fetchUserCampaign();

  const childProps = {
    pathname: '/dashboard/resources',
    articlesBySlug,
    user,
    campaign,
  };

  return <ResourcesPage {...childProps} />;
}
