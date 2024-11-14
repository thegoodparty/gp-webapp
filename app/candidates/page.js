import pageMetaData from 'helpers/metadataHelper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CandidatesPage from './components/CandidatesPage';
import { numberFormatter } from 'helpers/numberHelper';

const fetchCount = async (onlyWinners = false) => {
  const api = gpApi.campaign.mapCount;

  return await gpFetch(api, { results: onlyWinners ? true : undefined }, 3600);
};

export async function generateMetadata({ params, searchParams }) {
  const title = `3,120 Wins by Independents across the U.S. 🎉`;
  const meta = pageMetaData({
    title,
    description:
      'Find independent, people-powered, and anti-corruption candidates running for office in your area. Search by office type, name, party affiliation, and more.',
    slug: `/candidates`,
    image: 'https://assets.goodparty.org/candidates-map.jpg',
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const childProps = { searchParams };
  return <CandidatesPage {...childProps} />;
}
