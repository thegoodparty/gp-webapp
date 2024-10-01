import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CandidatesPage from './components/CandidatesPage';

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
    image: 'https://assets.goodparty.org/candidates-map.jpg',
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const { count } = await fetchCount();
  const childProps = { count };
  return <CandidatesPage {...childProps} />;
}
