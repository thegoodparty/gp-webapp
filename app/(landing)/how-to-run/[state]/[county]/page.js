import pageMetaData from 'helpers/metadataHelper';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import HowToRunCountyPage from './components/HowToRunCountyPage';

const fetchCounty = async (state, county) => {
  const api = gpApi.race.byCounty;
  const payload = {
    state,
    county,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { state } = params;
  const stateName = shortToLongState[state.toUpperCase()];
  const { county } = await fetchCounty(state, params.county);

  const meta = pageMetaData({
    title: `How to run in ${county.county} county`,
    description: `How to run in ${county.county} county`,
    slug: `/how-to-run/${state}/${params.county}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { state } = params;
  if (!state || !shortToLongState[state.toUpperCase()]) {
    notFound();
  }

  const { municipalities, races, county } = await fetchCounty(
    state,
    params.county,
  );

  const childProps = {
    state,
    childEntities: municipalities,
    races,
    county,
  };

  return <HowToRunCountyPage {...childProps} />;
}
