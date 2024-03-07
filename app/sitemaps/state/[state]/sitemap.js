import { fetchCity } from 'app/(landing)/elections/[state]/[county]/[city]/page';
import { fetchCounty } from 'app/(landing)/elections/[state]/[county]/page';
import { fetchState } from 'app/(landing)/elections/[state]/page';
import gpApi, { appBase } from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { flatStates } from 'helpers/statesHelper';

// const fetchState = async (state) => {
//   const api = gpApi.race.byState;
//   const payload = {
//     state,
//   };

//   return await gpFetch(api, payload, 10);
// };

// const fetchCounty = async (state, county) => {
//   const api = gpApi.race.byCounty;
//   const payload = {
//     state,
//     county,
//   };

//   return await gpFetch(api, payload, 10);
// };

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
    const { counties, races } = await fetchState(state);

    const mainSitemap = [];
    // state url
    const urls = [`/elections/${state}`];
    // state races
    for (let i = 0; i < races.length; i++) {
      urls.push(`/elections/position/${state}/${races[i].positionSlug}`);
    }

    for (let i = 0; i < counties.length; i++) {
      urls.push(`/elections/${counties[i].slug}`);
      const res = await fetchCounty(state, counties[i].name);
      const municipalities = res.municipalities;
      const countyRaces = res.races;
      // county races
      for (let j = 0; j < countyRaces.length; j++) {
        urls.push(
          `/elections/position/${counties[i].slug}/${countyRaces[j].positionSlug}`,
        );
      }

      for (let j = 0; j < municipalities.length; j++) {
        urls.push(`/elections/${municipalities[j].slug}`);
        const res = await fetchCity(
          state,
          counties[i].name,
          municipalities[j].name,
        );
        const cityRaces = res.races;
        for (let k = 0; k < cityRaces.length; k++) {
          urls.push(
            `/elections/position/${municipalities[j].slug}/${cityRaces[k].positionSlug}`,
          );
        }
      }
    }

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
