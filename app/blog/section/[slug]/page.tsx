import { notFound } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'
import { fetchArticlesBySection } from 'app/blog/shared/fetchArticlesBySection'
import BlogSectionPage from './components/BlogSectionPage'
import { fetchArticleTags } from 'app/blog/shared/fetchArticleTags'
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles'
import { fetchSections, BlogSection } from 'app/blog/shared/fetchSections'
import { fetchSection } from 'app/blog/shared/fetchSection'
import { Metadata } from 'next'

export const revalidate = 3600
export const dynamic = 'force-static'

interface PageParams {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const section = await fetchSection(slug)
  const sectionTitle = section?.fields?.title || ''

  const meta = pageMetaData({
    title: `${sectionTitle} | GoodParty.org Blog`,
    description: `Good Part Blog ${sectionTitle} Section`,
    slug: `/blog/section/${slug}`,
  })
  return meta
}

export default async function Page({ params }: PageParams): Promise<React.JSX.Element | null> {
  const { slug } = await params

  if (!slug) {
    notFound()
  }
  const [articlesBySection, tags, titles, sections] = await Promise.all([
    fetchArticlesBySection({ sectionSlug: slug }),
    fetchArticleTags(),
    fetchArticlesTitles(),
    fetchSections(),
  ])

  const articles = articlesBySection[slug] || []
  const hero = articles[0]
  const currentSection = sections.find((section: BlogSection) => section.fields?.slug === slug)

  const sectionTitle = currentSection?.fields?.title
  if (!currentSection || !sectionTitle) {
    notFound()
  }

  return (
    <BlogSectionPage
      sections={sections}
      articles={articles.filter(
        (article) => article.contentId !== hero?.contentId,
      )}
      sectionTitle={sectionTitle}
      currentSection={currentSection}
      slug={slug}
      hero={hero}
      allTags={tags}
      articleTitles={titles}
    />
  )
}

export async function generateStaticParams(): Promise<{ slug?: string }[]> {
  const sections = await fetchSections()

  return sections?.map((section: BlogSection) => {
    return {
      slug: section.fields?.slug,
    }
  }) || []
}
