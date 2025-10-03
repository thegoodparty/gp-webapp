import { faqArticleRoute, slugify } from 'helpers/articleHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import FaqsArticlePage from './components/FaqsArticlePage'
import pageMetaData from 'helpers/metadataHelper'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const revalidate = 3600
export const dynamic = 'force-static'

const fetchArticle = async (id) => {
  return await unAuthFetch(`${apiRoutes.content.byId.path}/${id}`)
}

async function findArticleIdByTitle(titleSlug) {
  const faqArticles = await unAuthFetch(
    `${apiRoutes.content.byType.path}/articleCategories`,
  )

  const matches = []

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

  return matches[0].id
}

export async function generateMetadata({ params }) {
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

export default async function Page({ params, searchParams }) {
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
    const correctRoute = faqArticleRoute(content)
    permanentRedirect(correctRoute)
  }

  const childProps = {
    article: content,
  }

  return <FaqsArticlePage {...childProps} />
}

export async function generateStaticParams() {
  const faqArticles = await unAuthFetch(
    `${apiRoutes.content.byType.path}/articleCategories`,
  )
  let articles = []

  faqArticles?.forEach((category) => {
    category?.articles?.forEach((article) => {
      articles.push({
        title: slugify(article?.title, true),
      })
    })
  })

  return articles
}
