import pageMetaData from 'helpers/metadataHelper'
import { fetchArticlesBySection } from 'app/blog/shared/fetchArticlesBySection'
import BlogPage from './components/BlogPage'
import { fetchArticleTags } from './shared/fetchArticleTags'
import { fetchArticlesTitles } from './shared/fetchArticlesTitles'
import { fetchContentByType } from 'helpers/fetchHelper'
import { fetchSections } from 'app/blog/shared/fetchSections'
import { fetchBlogArticlesList } from 'app/blog/shared/fetchBlogArticlesList'

export const revalidate = 3600
export const dynamic = 'force-static'
const SECTION_ARTICLES_LIMIT = 4

const fetchTopTags = async () => {
  return await fetchContentByType('blogHome')
}

const meta = pageMetaData({
  title: 'Blog | GoodParty.org',
  description: 'GoodParty.org Blog',
  slug: '/blog',
})
export const metadata = meta

export default async function Page() {
  const [[hero], articlesBySection, { tags: topTags }, tags, titles, sections] =
    await Promise.all([
      fetchBlogArticlesList({ limit: 2 }),
      fetchArticlesBySection({ limit: SECTION_ARTICLES_LIMIT }),
      fetchTopTags(),
      fetchArticleTags(),
      fetchArticlesTitles(),
      fetchSections(),
    ])

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

const filterOutHero = (articlesBySection, { contentId: heroContentId }) => {
  return Object.keys(articlesBySection).reduce((acc, key) => {
    acc[key] = articlesBySection[key]
      .filter((article) => article.contentId !== heroContentId)
      .slice(0, 3)
    return acc
  }, {})
}
