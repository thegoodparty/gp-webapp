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
    title: 'Candidate Search | GoodParty.org',
    description: 'Find your candidate for the upcoming election',
    slug: `/candidates`,
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  adminAccessOnly();
  const { campaigns } = await fetchCampaigns();

  const childProps = { campaigns };
  return <CandidatesPage {...childProps} />;
}
