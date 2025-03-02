/*
note: on local (dev) enviroment the path is http://localhost:4000/sitemaps/state/ca/sitemap.xml/4
on production the path is https://www.getelected.com/sitemaps/state/ca/sitemap/4.xml

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
*/

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { flatStates } from 'helpers/statesHelper';
import { APP_BASE } from 'appEnv';

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
        url: `${APP_BASE}${url}`,
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
