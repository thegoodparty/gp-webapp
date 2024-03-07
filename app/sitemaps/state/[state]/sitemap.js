import gpApi, { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { flatStates } from 'helpers/statesHelper';

const fetchState = async (state) => {
  const api = gpApi.race.allStates;
  const payload = {
    state,
  };

  return await gpFetch(api, payload, 3600);
};

const now = new Date();

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed

  return flatStates.map((state, index) => {
    return {
      id: index,
    };
  });
}

export default async function sitemap({ id }) {
  try {
    const state = flatStates[id].toLocaleLowerCase();
    const { counties, cities, stateRaces, countyRaces, cityRaces } =
      await fetchState(state);

    const mainSitemap = [];
    // state url
    const urls = [`/elections/${state}`];

    counties.forEach((county) => {
      urls.push(`/elections/${county.slug}`);
    });

    cities.forEach((city) => {
      urls.push(`/elections/${city.slug}`);
    });

    stateRaces.forEach((race) => {
      urls.push(`/elections/${race.slug}`);
    });

    countyRaces.forEach((race) => {
      urls.push(`/elections/${race.slug}`);
    });

    cityRaces.forEach((race) => {
      urls.push(`/elections/${race.slug}`);
    });

    urls.forEach((url) => {
      mainSitemap.push({
        url: `${appBase}${url}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
    return mainSitemap;
  } catch (e) {
    return [];
  }
}
