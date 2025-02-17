import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { notFound, redirect } from 'next/navigation';
import PositionPage from './components/PositionPage';
import PositionSchema from './components/PositionSchema';
import { fetchArticle } from 'app/blog/article/[slug]/page';

const fetchPosition = async (state, county, city, positionSlug) => {
  const api = gpApi.race.byRace;
  const payload = {
    state,
    county,
    city,
    positionSlug,
  };

  return await gpFetch(api, payload, 3600);
};

const parseLoc = (loc) => {
  const state = loc[0];
  const positionSlug = loc[loc.length - 1];
  let county, city;
  if (loc.length === 4) {
    county = loc[1];
    city = loc[2];
  }
  if (loc.length === 3) {
    county = loc[1];
  }
  return { state, county, city, positionSlug };
};
const year = new Date().getFullYear();

export async function generateMetadata({ params }) {
  const { loc } = params;
  const { state, county, city, positionSlug } = parseLoc(loc);
  const { race, otherRaces, positions } = await fetchPosition(
    state,
    county,
    city,
    positionSlug,
  );
  const slug = `elections/position/${loc.join('/')}`;

  const {
    level,
    positionName,
    positionDescription,
    locationName,
    normalizedPositionName,
  } = race || {};
  let locStr = locationName;
  if (!level || level.toLowerCase() === 'local') {
    locStr = `${
      locationName || race.municipality?.name || ''
    }, ${race?.state?.toUpperCase()}`;
  }
  if (level?.toLowerCase() === 'city') {
    locStr += ` City, ${race.state?.toUpperCase() || ''}`;
  } else if (level?.toLowerCase() === 'county') {
    locStr += ` County, ${race.state?.toUpperCase() || ''}`;
  } else if (level?.toLowerCase() === 'state') {
    // locStr += ` ${race.state.toUpperCase()}`
  }

  console.log('slug', slug);
  const meta = pageMetaData({
    title: `Run for ${normalizedPositionName} in ${locStr}`,
    description: `Learn the details about running for ${normalizedPositionName} in ${locStr}. Learn the requirements to run, what the job entails, and helpful tips for running a successful campaign. ${positionDescription}`,
    slug,
  });
  return meta;
}

export default async function Page({ params }) {
  const { loc } = params;
  if (!loc || loc.length === 0 || loc.length > 4) {
    return notFound();
  }
  const { state, county, city, positionSlug } = parseLoc(loc);
  const { race, otherRaces, positions } = await fetchPosition(
    state,
    county,
    city,
    positionSlug,
  );
  if (!race) {
    redirect(
      `/elections/${state}${county ? `/${county}` : ''}${
        city ? `/${city}` : ''
      }`,
    );
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
    race,
    otherRaces,
    articles,
    positions,
    state,
    county,
    city,
  };
  return (
    <>
      <PositionPage {...childProps} />
      <PositionSchema race={race} loc={loc} />
    </>
  );
}
