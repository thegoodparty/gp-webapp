import pageMetaData from 'helpers/metadataHelper';
import ElectionsStatePage from './components/ElectionsStatePage';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { fetchArticle } from 'app/blog/article/[slug]/page';

const fetchState = async (state, viewAll) => {
  const api = gpApi.race.byState;
  const payload = {
    state,
    viewAll: viewAll === 'true',
  };

  return await gpFetch(api, payload, 3600);
};

const year = new Date().getFullYear();

export async function generateMetadata({ params }) {
  const { state } = params;
  const stateName = shortToLongState[state.toUpperCase()];

  const meta = pageMetaData({
    title: `Run for Office in ${stateName} ${year}`,
    description: `Learn about available opportunities to run for office in ${stateName} and tips for launching a successful campaign.`,
    slug: `/elections/${state}`,
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const { state } = params;
  const { viewAll } = searchParams;
  if (!state || !shortToLongState[state.toUpperCase()]) {
    notFound();
  }

  const { counties, races } = await fetchState(state, viewAll);
  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ];
  const articles = [];
  for (const slug of articleSlugs) {
    const { content } = await fetchArticle(slug);
    articles.push(content);
  }

  const childProps = {
    state,
    childEntity: counties,
    races,
    viewAll,
    articles,
  };

  return <ElectionsStatePage {...childProps} />;
}
