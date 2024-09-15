import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CandidatesPage from './components/CandidatesPage';
import { adminAccessOnly } from 'helpers/permissionHelper';

export const fetchCampaigns = async () => {
  const api = gpApi.campaign.mapList;

  return await gpFetch(api);
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

  return <CandidatesPage />;
}
