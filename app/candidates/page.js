import pageMetaData from 'helpers/metadataHelper'
import CandidatesPage from './components/CandidatesPage'
import { numberFormatter } from 'helpers/numberHelper'

export const WINNER_COUNT = 3444

// const fetchCount = async (onlyWinners = false) => {
//   const api = gpApi.campaign.mapCount;

//   return await gpFetch(api, { results: onlyWinners ? true : undefined }, 3600);
// };

export async function generateMetadata({ params, searchParams }) {
  // const { count } = await fetchCount(true);
  const count = WINNER_COUNT
  const title = `${numberFormatter(
    count,
  )} Wins by Independents across the U.S. 🎉`
  const meta = pageMetaData({
    title,
    description:
      'Find independent, people-powered, and anti-corruption candidates running for office in your area. Search by office type, name, party affiliation, and more.',
    slug: `/candidates`,
    image: 'https://assets.goodparty.org/candidates-map.jpg',
  })
  return meta
}

export default async function Page({ params, searchParams }) {
  // const { count } = await fetchCount(true);
  const count = WINNER_COUNT
  const childProps = { count, searchParams }
  return <CandidatesPage {...childProps} />
}
