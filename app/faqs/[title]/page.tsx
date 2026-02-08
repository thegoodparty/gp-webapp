import { faqArticleRoute, slugify } from 'helpers/articleHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import FaqsArticlePage from './components/FaqsArticlePage'
import pageMetaData from 'helpers/metadataHelper'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const revalidate = 3600
export const dynamic = 'force-static'

interface Article {
  id: string
  title: string
}

interface ArticleCategory {
  articles?: Article[]
}

interface FaqContent {
  title: string
  articleBody: string
  category?: {
    fields?: {
      name?: string
    }
  }
}

const fetchArticle = async (id: string): Promise<FaqContent | null> => {
  return await unAuthFetch(`${apiRoutes.content.byId.path}/${id}`)
}

async function findArticleIdByTitle(titleSlug: string): Promise<string | null> {
  const faqArticles = await unAuthFetch<ArticleCategory[]>(
    `${apiRoutes.content.byType.path}/articleCategories`,
  )

  interface Match {
    id: string
    title: string
    originalSlug: string
  }

  const matches: Match[] = []

  faqArticles?.forEach((category) => {
    category?.articles?.forEach((article) => {
      if (
        article?.title &&
        slugify(article.title, true) === slugify(titleSlug, true)
      ) {
        matches.push({
          id: article.id,
          title: article.title,
          originalSlug: slugify(article.title, true),
        })
      }
    })
  })

  if (matches.length === 0) {
    return null
  }

  if (matches.length > 1) {
    console.warn(
      `Multiple FAQ articles found with slug "${titleSlug}":`,
      matches.map((m) => m.title),
    )
  }

  const firstMatch = matches[0]
  return firstMatch ? firstMatch.id : null
}

interface PageParams {
  title: string
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
  const { title } = await params
  const id = await findArticleIdByTitle(title)

  if (!id) {
    return {}
  }

  const content = await fetchArticle(id)

  const meta = pageMetaData({
    title: `${content?.title} | FAQs | GoodParty.org`,
    description: 'Frequently Asked Questions about GoodParty.org.',
    slug: `/faqs/${title}`,
  })
  return meta
}

export default async function Page({ params }: { params: Promise<PageParams> }): Promise<React.JSX.Element> {
  const { title } = await params
  const id = await findArticleIdByTitle(title)

  if (!id) {
    notFound()
  }

  const content = await fetchArticle(id)

  if (!content) {
    notFound()
  }

  const articleTitle = content.title

  if (slugify(articleTitle, true) !== title.toLowerCase()) {
    const correctRoute = faqArticleRoute(content.title)
    permanentRedirect(correctRoute)
  }

  const childProps = {
    article: content,
  }

  return <FaqsArticlePage {...childProps} />
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const faqArticles = await unAuthFetch<ArticleCategory[]>(
    `${apiRoutes.content.byType.path}/articleCategories`,
  )
  const articles: PageParams[] = []

  faqArticles?.forEach((category) => {
    category?.articles?.forEach((article) => {
      articles.push({
        title: slugify(article?.title, true),
      })
    })
  })

  return articles
}
