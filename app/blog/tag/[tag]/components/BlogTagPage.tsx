import BlogWrapper from 'app/blog/shared/BlogWrapper'
import ArticleSnippet, { Article } from 'app/blog/shared/ArticleSnippet'
import LoadMoreWrapper from 'app/blog/shared/LoadMoreWrapper'
import { FIRST_PAGE_SIZE } from 'app/blog/section/[slug]/components/BlogSectionPage'

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

interface BlogTagPageProps {
  sections: BlogSection[]
  tagName: string
  tagSlug: string
  articles: Article[]
  allTags: BlogTag[]
  articleTitles: ArticleTitle[]
}

export default function BlogTagPage({
  sections,
  tagName,
  tagSlug,
  articles,
  allTags,
  articleTitles,
}: BlogTagPageProps): React.JSX.Element {
  const firstPageArticles = articles.slice(0, FIRST_PAGE_SIZE)
  const loadMoreArticles = articles.slice(FIRST_PAGE_SIZE)

  return (
    <BlogWrapper
      sections={sections}
      pageTitle={tagName}
      pageSlug={tagSlug}
      allTags={allTags}
      articleTitles={articleTitles}
    >
      <div className="border-t border-gray-200 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
          {firstPageArticles.map((article) => (
            <ArticleSnippet article={article} key={article.slug} />
          ))}
        </div>

        {loadMoreArticles?.length > 0 && (
          <LoadMoreWrapper className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-16">
              {loadMoreArticles.map((article) => (
                <ArticleSnippet article={article} key={article.slug} />
              ))}
            </div>
          </LoadMoreWrapper>
        )}
      </div>
    </BlogWrapper>
  )
}
