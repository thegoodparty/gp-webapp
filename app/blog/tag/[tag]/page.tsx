import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import BlogTagPage from './components/BlogTagPage'
import { fetchArticleTags } from 'app/blog/shared/fetchArticleTags'
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles'
import { fetchSections } from 'app/blog/shared/fetchSections'
import { fetchArticlesByTag } from 'app/blog/shared/fetchArticlesByTag'
import { fetchArticleTag } from 'app/blog/shared/fetchArticleTag'
import { Metadata } from 'next'

export const revalidate = 3600
export const dynamic = 'force-static'

interface PageParams {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { tag } = await params

  const tagData = await fetchArticleTag(tag)

  const meta = pageMetaData({
    title: `${tagData.name} | GoodParty.org Blog`,
    description: `Good Part Blog ${tagData.name} tag`,
    slug: `/blog/tag/${tag}`,
  })
  return meta
}

export default async function Page({ params }: PageParams): Promise<React.JSX.Element | null> {
  const { tag } = await params
  if (!tag) {
    notFound()
  }
  const [sections, tagData, articles, tags, titles] =
    await Promise.all([
      fetchSections(),
      fetchArticleTag(tag),
      fetchArticlesByTag(tag),
      fetchArticleTags(),
      fetchArticlesTitles(),
    ])

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <BlogTagPage
      sections={sections}
      tagName={tagData.name}
      tagSlug={tag}
      articles={articles}
      allTags={tags}
      articleTitles={titles}
    />
  )
}

export async function generateStaticParams(): Promise<{ tag: string }[]> {
  const tags = await fetchArticleTags()

  return tags?.map((tagItem) => {
    return {
      tag: tagItem.slug,
    }
  }) || []
}
