import pageMetaData from 'helpers/metadataHelper';
import HowToRunStatePage from './components/HowToRunStatePage';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

const fetchState = async (state) => {
  const api = gpApi.race.byState;
  const payload = {
    state,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { state } = params;
  const stateName = shortToLongState[state.toUpperCase()];

  const meta = pageMetaData({
    title: `How to run in ${stateName}`,
    description: `How to run in ${stateName}`,
    slug: `/how-to-run/${state}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { state } = params;
  if (!state || !shortToLongState[state.toUpperCase()]) {
    notFound();
  }

  const { counties, races } = await fetchState(state);

  const childProps = {
    state,
    childEntity: counties,
    races,
  };

  return <HowToRunStatePage {...childProps} />;
}
