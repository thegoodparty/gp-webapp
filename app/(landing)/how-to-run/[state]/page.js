import pageMetaData from 'helpers/metadataHelper';
import HowToRunStatePage from './components/HowToRunStatePage';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export const fetchState = async (state) => {
  const api = gpApi.race.byState;
  const payload = {
    state,
  };

  console.log('api', api);

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { state } = params;

  const meta = pageMetaData({
    title: `How to run in ${state}`,
    description: `How to run in ${state}`,
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
  console.log('cc', counties);

  const childProps = {
    state,
    counties,
    races,
  };

  return <HowToRunStatePage {...childProps} />;
}
