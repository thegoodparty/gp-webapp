import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CandidatesPage from './components/CandidatesPage';
import { adminAccessOnly } from 'helpers/permissionHelper';

const fetchCount = async () => {
  const api = gpApi.campaign.mapCount;

  return await gpFetch(api, false, 3600);
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
  adminAccessOnly();
  const { count } = await fetchCount();
  const childProps = { count };
  return <CandidatesPage {...childProps} />;
}
