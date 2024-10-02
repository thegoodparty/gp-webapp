import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CandidatesPage from '../components/CandidatesPage';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';

const fetchCount = async (state) => {
  const api = gpApi.campaign.mapCount;

  return await gpFetch(api, { state }, 3600);
};

export async function generateMetadata({ params, searchParams }) {
  const meta = pageMetaData({
    title: 'GoodParty.org Certified Independent Candidates',
    description:
      'Find independent, people-powered, and anti-corruption candidates running for office in your area. Search by office type, name, party affiliation, and more.',
    slug: `/candidates`,
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const { state } = params;
  const upperState = state.toUpperCase();
  const longState = shortToLongState[upperState];
  if (!longState) {
    notFound();
  }
  await adminAccessOnly();
  const { count } = await fetchCount(upperState);
  const childProps = { count, longState, state: upperState };
  return <CandidatesPage {...childProps} />;
}
