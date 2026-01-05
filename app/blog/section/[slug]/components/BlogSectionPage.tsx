import { Fragment } from 'react'
import BlogWrapper from 'app/blog/shared/BlogWrapper'
import ArticleSnippet from 'app/blog/shared/ArticleSnippet'
import MarketingH5 from '@shared/typography/MarketingH5'
import SubscribeBlog from 'app/blog/shared/SubscribeBlog'
import LoadMoreWrapper from 'app/blog/shared/LoadMoreWrapper'
import { Article } from 'app/blog/shared/ArticleSnippet'

export const FIRST_PAGE_SIZE = 15

interface BlogSection {
  fields?: {
    title?: string
    subtitle?: string
    slug?: string
  }
  tags?: { name: string; slug: string }[]
}

interface BlogTag {
  name: string
  slug: string
}

interface ArticleTitle {
  title: string
  slug: string
}

interface BlogSectionPageProps {
  sections: BlogSection[]
  articles: Article[]
  currentSection: BlogSection
  slug: string
  hero?: Article
  allTags: BlogTag[]
  articleTitles: ArticleTitle[]
  sectionTitle: string
}

export default function BlogSectionPage({
  sections,
  articles,
  currentSection,
  slug,
  hero,
  allTags,
  articleTitles,
  sectionTitle,
}: BlogSectionPageProps): React.JSX.Element {
  const firstPageArticles = articles.slice(0, FIRST_PAGE_SIZE)
  const loadMoreArticles = articles.slice(FIRST_PAGE_SIZE)

  const renderArticles = (items: Article[], showSubscribe: boolean): React.JSX.Element[] => {
    return items.map((item, index) => (
      <Fragment key={item.id || item.slug}>
        <ArticleSnippet article={item} section={currentSection} />
        {showSubscribe && index === 2 && (
          <SubscribeBlog className="col-span-1 lg:col-span-3" />
        )}
      </Fragment>
    ))
  }

  return (
    <BlogWrapper
      sections={sections}
      topTags={currentSection.tags}
      pageTitle={sectionTitle}
      pageSubtitle={currentSection.fields?.subtitle}
      pageSlug={slug}
      allTags={allTags}
      articleTitles={articleTitles}
    >
      {slug && articles.length > 1 && (
        <div className="border-t border-gray-200 py-16">
          <MarketingH5 className="mb-6">Featured Article</MarketingH5>
          {hero && <ArticleSnippet article={hero} heroMode section={currentSection} />}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
            {renderArticles(firstPageArticles, true)}
          </div>
          {loadMoreArticles?.length > 0 && (
            <LoadMoreWrapper className="mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
                {renderArticles(loadMoreArticles, false)}
              </div>
            </LoadMoreWrapper>
          )}
        </div>
      )}
    </BlogWrapper>
  )
}
