import pageMetaData from 'helpers/metadataHelper'
import CandidatesPage from './components/CandidatesPage'
import { numberFormatter } from 'helpers/numberHelper'
import { SearchParams } from 'next/dist/server/request/search-params'

export const WINNER_COUNT = 3444

export const generateMetadata = async () => {
  const title = `${numberFormatter(
    WINNER_COUNT,
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
  searchParams: SearchParams
}

const Page = async ({
  searchParams,
}: PageProps): Promise<React.JSX.Element> => {
  const childProps = {
    count: WINNER_COUNT,
    searchParams,
    longState: undefined,
    state: undefined,
  }
  return <CandidatesPage {...childProps} />
}

export default Page
