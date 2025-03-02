import pageMetaData from 'helpers/metadataHelper';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound, redirect } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ElectionsCityPage from './components/ElectionsCityPage';
import { fetchArticle } from 'app/blog/article/[slug]/page';

export const revalidate = 3600;
export const dynamic = 'force-static';

export const fetchCity = async (state, county, city) => {
  const api = gpApi.race.byCity;
  const payload = {
    state,
    county,
    city,
  };

  return await gpFetch(api, payload, 3600);
};

const year = new Date().getFullYear();

export async function generateMetadata({ params }) {
  const { state, county, city } = params;
  const stateName = shortToLongState[state.toUpperCase()];
  const { municipality, races } = await fetchCity(state, county, city);

  const meta = pageMetaData({
    title: `Run for Office in ${municipality.city}, ${stateName} ${year}`,
    description: `Learn about opportunities to run for office in ${municipality.city}, ${stateName} and a helpful tips for a successful campaign.`,
    slug: `/elections/${state}/${county}/${city}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { state, county, city } = params;
  if (!state || !shortToLongState[state.toUpperCase()]) {
    notFound();
  }

  const { municipality, races } = await fetchCity(state, county, city);
  if (!municipality) {
    notFound();
  }

  const articleSlugs = [
    '8-things-to-know-before-running-for-local-office',
    'turning-passion-into-action-campaign-launch',
    'comprehensive-guide-running-for-local-office',
  ];
  const articles = [];
  for (const slug of articleSlugs) {
    const content = await fetchArticle(slug);
    articles.push(content);
  }

  const childProps = {
    state,
    municipality,
    races,
    county,
    articles,
  };

  return <ElectionsCityPage {...childProps} />;
}
