import TermsHomePage from './components/TermsHomePage'
import pageMetaData from 'helpers/metadataHelper'
import {
  fetchGlossaryByLetter,
  fetchGlossaryByTitle,
} from 'app/political-terms/util/glossaryItemFetching.util'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Political Terms & Definitions | GoodParty.org',
  description:
    'Political terms and definitions, elevate your political game with our easy to use political database at GoodParty.org',
  slug: '/political-terms',
})
export const metadata = meta

export default async function Page() {
  const content = await fetchGlossaryByLetter()
  const a_items = content['A']

  const glossaryItems = await fetchGlossaryByTitle()

  let glossaryItemsArray = []
  Object.keys(glossaryItems).forEach((item) => {
    glossaryItemsArray.push(glossaryItems[item].title)
  })
  glossaryItemsArray.sort()

  const childProps = {
    activeLetter: 'A',
    items: a_items,
    glossaryItems: glossaryItemsArray,
  }
  return <TermsHomePage {...childProps} />
}
