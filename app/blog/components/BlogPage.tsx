import { Fragment } from 'react'
import Link from 'next/link'
import BlogWrapper from '../shared/BlogWrapper'
import ArticleSnippet from '../shared/ArticleSnippet'
import MarketingH5 from '@shared/typography/MarketingH5'
import SubscribeBlog from '../shared/SubscribeBlog'

interface ImageData {
  url: string
  alt?: string
}

interface Section {
  id: string
  fields?: {
    slug?: string
    title?: string
    order?: string | number
  }
}

interface Article {
  id: string
  title: string
  slug: string
  publishDate: string
  summary?: string
  mainImage?: ImageData
  section?: Section
}

interface Tag {
  slug: string
  name: string
}

interface ArticleTitle {
  title: string
  slug: string
}

interface ArticlesBySection {
  [slug: string]: Article[]
}

interface BlogPageProps {
  sections: Section[]
  hero: Article
  topTags?: Tag[]
  allTags?: Tag[]
  articleTitles?: ArticleTitle[]
  articlesBySection: ArticlesBySection
}

export default async function BlogPage({
  sections,
  hero,
  topTags,
  allTags,
  articleTitles,
  articlesBySection,
}: BlogPageProps): Promise<React.JSX.Element> {
  return (
    <BlogWrapper
      sections={sections}
      pageTitle="Blog"
      pageSubtitle="Insights into politics, running for office, and the latest updates from the independent movement"
      topTags={topTags}
      showBreadcrumbs={false}
      allTags={allTags}
      articleTitles={articleTitles}
    >
      {sections?.length > 0 && (
        <div className="border-t-[1px] border-gray-200 pt-16 pb-8">
          <MarketingH5 className="mb-6">Featured Article</MarketingH5>
          <ArticleSnippet article={hero} heroMode section={hero.section} />
          {sections.map((section, index) => {
            const sectionSlug = section.fields?.slug || ''
            const sectionArticles = articlesBySection[sectionSlug] || []
            return (
              <Fragment key={section.id}>
                <Link
                  className="group no-underline flex justify-between align-center mb-6 mt-16"
                  href={`/blog/section/${section.fields?.slug}`}
                  id={`blog-${section.fields?.slug}`}
                  aria-label={section.fields?.title}
                >
                  <MarketingH5 className="!m-0">
                    {section.fields?.title}
                  </MarketingH5>
                  <button className="text-sm text-dark bg-transparent rounded-lg py-2 px-3 group-hover:bg-gray-100">
                    Read More
                  </button>
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {sectionArticles.map((article) => (
                    <ArticleSnippet
                      key={article.id}
                      article={article}
                      section={section}
                    />
                  ))}
                </div>
                {index === 0 && (
                  <SubscribeBlog className="col-span-1 lg:col-span-3 mt-16" />
                )}
              </Fragment>
            )
          })}
        </div>
      )}
    </BlogWrapper>
  )
}
