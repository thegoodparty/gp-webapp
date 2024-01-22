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

  return await gpFetch(api, payload, 1);
};

export async function generateMetadata({ params }) {
  const { state } = params;
  const stateName = shortToLongState[state.toUpperCase()];

  const meta = pageMetaData({
    title: `How to run in ${stateName}`,
    description: `How to run in ${stateName}`,
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
