import pageMetaData from 'helpers/metadataHelper';
import CandidatesPage from '../components/CandidatesPage';
import { adminAccessOnly } from 'helpers/permissionHelper';
import { shortToLongState } from 'helpers/statesHelper';
import { notFound } from 'next/navigation';
import { serverFetch } from 'gpApi/serverFetch';
import { apiRoutes } from 'gpApi/routes';

const fetchCount = async (state, onlyWinners = false) => {
  const resp = await serverFetch(
    apiRoutes.campaign.map.count,
    {
      state,
      results: onlyWinners ? true : undefined,
    },
    { revalidate: 3600 },
  );
  return resp.data;
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
  const count = await fetchCount(upperState, true);
  const childProps = { count, longState, state: upperState, searchParams };
  return <CandidatesPage {...childProps} />;
}
