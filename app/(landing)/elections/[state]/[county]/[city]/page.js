import pageMetaData from 'helpers/metadataHelper';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ElectionsCityPage from './components/ElectionsCityPage';

const fetchCity = async (state, county, city) => {
  const api = gpApi.race.byCity;
  const payload = {
    state,
    county,
    city,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { state, county, city } = params;
  const stateName = shortToLongState[state.toUpperCase()];
  const { municipality, races } = await fetchCity(state, county, city);

  const meta = pageMetaData({
    title: `How to run in ${municipality.city}, ${stateName}`,
    description: `How to run in ${municipality.city}, ${stateName}`,
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

  const childProps = {
    state,
    municipality,
    races,
    county,
  };

  return <ElectionsCityPage {...childProps} />;
}
