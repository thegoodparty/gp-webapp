import TermsHomePage from '../components/TermsHomePage'
import TermsItemPage from './components/TermsItemPage'
import DefinedTermSchema from './DefinedTermSchema'
import pageMetaData from 'helpers/metadataHelper'
import { notFound } from 'next/navigation'
import {
  fetchGlossaryByLetter,
  fetchGlossaryItemsBySlug,
} from 'app/political-terms/util/glossaryItemFetching.util'

export const revalidate = 3600
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const lettersArray = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const itemsBySlug = await fetchGlossaryItemsBySlug()
  const slugs = [...lettersArray, ...Object.keys(itemsBySlug)]

  return slugs.map((slug) => {
    return {
      slug,
    }
  })
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const itemsBySlug = await fetchGlossaryItemsBySlug()
  const item = itemsBySlug[slug]
  let meta
  if (slug.length === 1) {
    meta = pageMetaData({
      title: `Political Terms - ${slug.toUpperCase()} | GoodParty.org`,
      description:
        'Political terms and definitions, elevate your political game with our easy to use political database at GoodParty.org',
      slug: `/political-terms/${slug}`,
    })
  } else {
    if (!item) {
      notFound()
    }
    const title = item?.title
    meta = pageMetaData({
      title: `${title} Meaning & Definition | GoodParty.org`,
      description: `${title} meaning and definition. Find 100's of terms related to the US political system at GoodParty.org!`,
      slug: `/political-terms/${slug}`,
    })
  }
  return meta
}

export default async function Page({ params }) {
  const { slug } = params
  const itemsBySlug = await fetchGlossaryItemsBySlug()
  const itemsByLetter = await fetchGlossaryByLetter()
  const item = itemsBySlug[slug]
  const items = itemsByLetter[slug.toUpperCase()]

  if (!slug) {
    notFound()
  }

  const activeLetter = slug.charAt(0).toUpperCase()
  if (slug.length === 1) {
    return <TermsHomePage activeLetter={activeLetter} items={items} />
  }
  const childProps = { item, slug, activeLetter, items }

  return (
    <>
      <TermsItemPage {...childProps} />
      <DefinedTermSchema {...childProps} />
    </>
  )
}
