import ArticleSchema from './ArticleSchema'
import BlogArticlePage from './components/BlogArticlePage'
import pageMetaData from 'helpers/metadataHelper'
import { redirect, notFound, permanentRedirect } from 'next/navigation'
import { fetchArticlesTitles } from 'app/blog/shared/fetchArticlesTitles'
import { fetchArticle } from './utils'
import redirectList from './redirectList'
import { Metadata } from 'next'

export const revalidate = 3600
export const dynamic = 'force-static'

interface PageParams {
  params: Promise<{ slug: string }>
}

type RedirectSlug = keyof typeof redirectList

const isRedirectSlug = (slug: string): slug is RedirectSlug => {
  return slug in redirectList
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params
  const content = await fetchArticle(slug)

  if (!content || content.statusCode === 404) {
    return pageMetaData({
      title: 'Not Found | GoodParty.org',
      description: 'GoodParty.org - Content not found',
      image: 'https://goodparty.org/images/goodparty-logo.png',
      slug: `/blog/article/${slug}`,
    })
  }

  return pageMetaData({
    title: `${content.title || ''} | GoodParty.org`,
    description: content.summary || '',
    image: content.mainImage?.url
      ? `https:${content.mainImage.url}`
      : 'https://assets.goodparty.org/gp-share.png',
    slug: `/blog/article/${slug}`,
  })
}

export default async function Page({
  params,
}: PageParams): Promise<React.JSX.Element> {
  const { slug } = await params
  if (!slug) {
    redirect('/blog')
  }

  const content = await fetchArticle(slug)

  if (!content || content.statusCode === 404) {
    if (isRedirectSlug(slug)) {
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

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const articles = await fetchArticlesTitles()

  return (
    articles?.map((article) => {
      return {
        slug: article.slug,
      }
    }) || []
  )
}
