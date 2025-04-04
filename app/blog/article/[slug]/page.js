import ArticleSchema from './ArticleSchema'
import BlogArticlePage from './components/BlogArticlePage'
import pageMetaData from 'helpers/metadataHelper'
import { redirect, notFound, permanentRedirect } from 'next/navigation'
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles'
import { apiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import redirectList from './redirectList'
export const revalidate = 3600
export const dynamic = 'force-static'

export const fetchArticle = async (slug) => {
  return await unAuthFetch(`${apiRoutes.content.blogArticle.getBySlug.path}`, {
    slug,
  })
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const content = await fetchArticle(slug)

  if (!content || content?.statusCode === 404) {
    return pageMetaData({
      title: 'Not Found | GoodParty.org',
      description: 'GoodParty.org - Content not found',
      image: 'https://goodparty.org/images/goodparty-logo.png',
      slug: '/blog/article/${slug}',
    })
  }

  return pageMetaData({
    title: `${content?.title} | GoodParty.org`,
    description: content.summary,
    image: content.mainImage && `https:${content?.mainImage?.url}`,
    slug: `/blog/article/${slug}`,
  })
}

export default async function Page({ params }) {
  const { slug } = params
  if (!slug) {
    redirect('/blog')
  }

  const content = await fetchArticle(slug)

  if (!content || content?.statusCode === 404) {
    if (redirectList[slug]) {
      permanentRedirect(`/blog`)
    }
    notFound()
  }

  return (
    <>
      <BlogArticlePage article={content} />
      <ArticleSchema article={content} />
    </>
  )
}

export async function generateStaticParams({ params }) {
  const articles = await fetchArticlesTitles()

  return articles?.map((article) => {
    return {
      slug: article?.slug,
    }
  })
}
