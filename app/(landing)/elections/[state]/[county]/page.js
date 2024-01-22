import pageMetaData from 'helpers/metadataHelper';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ElectionsCountyPage from './components/ElectionsCountyPage';
import PositionPage from './components/PositionPage';

const fetchCounty = async (state, county) => {
  const api = gpApi.race.byCounty;
  const payload = {
    state,
    county,
  };

  return await gpFetch(api, payload, 3600);
};

const fetchPosition = async (id) => {
  const api = gpApi.race.byRace;
  const payload = {
    id,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  const { state } = params;
  if (state.length === 2) {
    const stateName = shortToLongState[state.toUpperCase()];
    const { county } = await fetchCounty(state, params.county);

    const meta = pageMetaData({
      title: `How to run in ${county.county} county, ${stateName}`,
      description: `How to run in ${county.county} county, ${stateName}`,
      slug: `/elections/${state}/${params.county}`,
    });
    return meta;
  }
  const { race } = await fetchPosition(params.county);
  const meta = pageMetaData({
    title: race.data.position_name,
    description: race.data.position_description,
    slug: `/elections/${state}/${params.county}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { state } = params;
  if (
    !state ||
    (state.length === 2 && !shortToLongState[state.toUpperCase()])
  ) {
    notFound();
  }
  if (state.length > 2) {
    // state is the slug, county is the id
    const { race } = await fetchPosition(params.county); // this is the id
    const childProps = { race };
    return <PositionPage {...childProps} />;
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

  return <ElectionsCountyPage {...childProps} />;
}
