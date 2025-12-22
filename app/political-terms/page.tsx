import TermsHomePage from './components/TermsHomePage'
import pageMetaData from 'helpers/metadataHelper'
import {
  fetchGlossaryByLetter,
  fetchGlossaryByTitle,
  GlossaryItem,
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

export default async function Page(): Promise<React.JSX.Element> {
  const content = await fetchGlossaryByLetter()
  const a_items: GlossaryItem[] = content['A'] || []

  const glossaryItems = await fetchGlossaryByTitle()

  const glossaryItemsArray: string[] = []
  Object.keys(glossaryItems).forEach((key) => {
    const item = glossaryItems[key]
    if (item) {
      glossaryItemsArray.push(item.title)
    }
  })
  glossaryItemsArray.sort()

  const childProps = {
    activeLetter: 'A',
    items: a_items,
    glossaryItems: glossaryItemsArray,
  }
  return <TermsHomePage {...childProps} />
}
