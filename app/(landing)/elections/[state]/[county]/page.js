import pageMetaData from 'helpers/metadataHelper';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ElectionsCountyPage from './components/ElectionsCountyPage';
import PositionPage from './components/poistionPage/PositionPage';
import { fetchArticle } from 'app/blog/article/[slug]/page';

const fetchCounty = async (state, county, viewAll) => {
  const api = gpApi.race.byCounty;
  const payload = {
    state,
    county,
    viewAll: viewAll === 'true',
  };

  return await gpFetch(api, payload, 3600);
};

const fetchPosition = async (id) => {
  const api = gpApi.race.byRace;
  const payload = {
    id,
  };

  console.log('api', api);

  return await gpFetch(api, payload, 10);
};

const year = new Date().getFullYear();

export async function generateMetadata({ params }) {
  const { state } = params;
  if (state.length === 2) {
    const stateName = shortToLongState[state.toUpperCase()];
    const { county } = await fetchCounty(state, params.county);

    const meta = pageMetaData({
      title: `Run for Office in ${county.county} county, ${stateName} ${year}`,
      description: `Learn about available opportunities to run for office in ${county.county} county, ${stateName} and tips for launching a successful campaign.`,
      slug: `/elections/${state}/${params.county}`,
    });
    return meta;
  }
  const { race } = await fetchPosition(params.county);
  console.log('race', race);
  const {
    level,
    positionName,
    positionDescription,
    locationName,
    normalizedPositionName,
  } = race;
  let loc = locationName;
  if (level === 'city') {
    loc += ` City, ${race.state}`;
  } else if (level === 'county') {
    loc += ` County, ${race.state}`;
  } else if (level === 'state') {
    loc += ` ${race.state}`;
  }
  const meta = pageMetaData({
    title: `Run for ${positionName} in ${loc}`,
    description: `Learn the details about running for ${normalizedPositionName} in ${loc}. Learn the requirements to run, what the job entails, and helpful tips for running a successful campaign. ${positionDescription}`,
    slug: `/elections/${state}/${params.county}`,
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const { state } = params;
  const { viewAll } = searchParams;
  if (
    !state ||
    (state.length === 2 && !shortToLongState[state.toUpperCase()])
  ) {
    notFound();
  }
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
  if (state.length > 2) {
    // state is the slug, county is the id
    const { race, otherRaces } = await fetchPosition(params.county); // this is the id

    const childProps = { race, otherRaces, articles };
    return <PositionPage {...childProps} />;
  }

  const { municipalities, races, county } = await fetchCounty(
    state,
    params.county,
    viewAll,
  );

  const childProps = {
    state,
    childEntities: municipalities,
    races,
    county,
    articles,
  };

  return <ElectionsCountyPage {...childProps} />;
}
