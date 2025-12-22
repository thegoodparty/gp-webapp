import TermsHomePage from '../components/TermsHomePage'
import TermsItemPage from './components/TermsItemPage'
import DefinedTermSchema from './DefinedTermSchema'
import pageMetaData from 'helpers/metadataHelper'
import { notFound } from 'next/navigation'
import {
  fetchGlossaryByLetter,
  fetchGlossaryItemsBySlug,
  GlossaryItem,
} from 'app/political-terms/util/glossaryItemFetching.util'
import { ALPHABET } from '@shared/utils/alphabet'
import { Metadata } from 'next'

export const revalidate = 3600
export const dynamic = 'force-static'

interface PageParams {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const itemsBySlug = await fetchGlossaryItemsBySlug()
  const slugs = [...ALPHABET, ...Object.keys(itemsBySlug)]

  return slugs.map((slug) => {
    return {
      slug,
    }
  })
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
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
    const title = item.title
    meta = pageMetaData({
      title: `${title} Meaning & Definition | GoodParty.org`,
      description: `${title} meaning and definition. Find 100's of terms related to the US political system at GoodParty.org!`,
      slug: `/political-terms/${slug}`,
    })
  }
  return meta
}

export default async function Page({ params }: PageParams): Promise<React.JSX.Element> {
  const { slug } = await params
  const itemsBySlug = await fetchGlossaryItemsBySlug()
  const itemsByLetter = await fetchGlossaryByLetter()
  const item: GlossaryItem | undefined = itemsBySlug[slug]
  const items: GlossaryItem[] = itemsByLetter[slug.toUpperCase()] || []

  if (!slug) {
    notFound()
  }

  // Build glossaryItems array for the home page
  const glossaryItemsArray: string[] = Object.values(itemsBySlug)
    .map((glossaryItem) => glossaryItem.title)
    .sort()

  const activeLetter = slug.charAt(0).toUpperCase()
  if (slug.length === 1) {
    return (
      <TermsHomePage
        activeLetter={activeLetter}
        items={items}
        glossaryItems={glossaryItemsArray}
      />
    )
  }
  return (
    <>
      <TermsItemPage item={item} items={items} activeLetter={activeLetter} />
      {item && <DefinedTermSchema item={item} slug={slug} />}
    </>
  )
}
