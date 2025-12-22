import pageMetaData from 'helpers/metadataHelper'
import { fetchArticlesBySection } from 'app/blog/shared/fetchArticlesBySection'
import BlogPage from './components/BlogPage'
import { fetchArticleTags } from './shared/fetchArticleTags'
import { fetchArticlesTitles } from './shared/fetchArticlesTitles'
import { fetchContentByType } from 'helpers/fetchHelper'
import { fetchSections } from 'app/blog/shared/fetchSections'
import { fetchBlogArticlesList } from 'app/blog/shared/fetchBlogArticlesList'
import { Article } from 'app/blog/shared/ArticleSnippet'

export const revalidate = 3600
export const dynamic = 'force-static'
const SECTION_ARTICLES_LIMIT = 4

interface Tag {
  name: string
  slug: string
}

interface BlogHomeContent {
  tags?: Tag[]
}

interface ArticlesBySection {
  [key: string]: Article[]
}

const fetchTopTags = async (): Promise<BlogHomeContent> => {
  return await fetchContentByType<BlogHomeContent>('blogHome')
}

const meta = pageMetaData({
  title: 'Blog | GoodParty.org',
  description: 'GoodParty.org Blog',
  slug: '/blog',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  const [articles, articlesBySection, topTagsContent, tags, titles, sections] =
    await Promise.all([
      fetchBlogArticlesList({ limit: 2 }),
      fetchArticlesBySection({ limit: SECTION_ARTICLES_LIMIT }),
      fetchTopTags(),
      fetchArticleTags(),
      fetchArticlesTitles(),
      fetchSections(),
    ])

  const hero = articles[0]
  const topTags = topTagsContent?.tags

  return (
    <BlogPage
      sections={sections}
      hero={hero}
      topTags={topTags}
      allTags={tags}
      articleTitles={titles}
      articlesBySection={filterOutHero(articlesBySection, hero)}
    />
  )
}

const filterOutHero = (
  articlesBySection: ArticlesBySection,
  hero?: Article,
): ArticlesBySection => {
  const heroContentId = hero?.contentId
  return Object.keys(articlesBySection).reduce<ArticlesBySection>((acc, key) => {
    const sectionArticles = articlesBySection[key] || []
    acc[key] = sectionArticles
      .filter((article) => article.contentId !== heroContentId)
      .slice(0, 3)
    return acc
  }, {})
}
