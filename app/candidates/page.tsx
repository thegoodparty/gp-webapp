import pageMetaData from 'helpers/metadataHelper'
import CandidatesPage from './components/CandidatesPage'
import { numberFormatter } from 'helpers/numberHelper'

const WINNER_COUNT = 3444

// const fetchCount = async (onlyWinners = false) => {
//   const api = gpApi.campaign.mapCount;
//
//   return await gpFetch(api, { results: onlyWinners ? true : undefined }, 3600);
// };

export async function generateMetadata() {
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

interface PageProps {
  searchParams: Record<string, string>
}

export default async function Page({ searchParams }: PageProps) {
  // const { count } = await fetchCount(true);
  const count = WINNER_COUNT
  const childProps = { count, searchParams, longState: undefined, state: undefined }
  return <CandidatesPage {...childProps} />
}
