import { faqArticleRoute } from '../../helpers/articleHelper'
import { apiRoutes } from 'gpApi/routes'
import { APP_BASE } from 'appEnv'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import { fetchContentByType } from 'helpers/fetchHelper'
import { fetchBlogArticlesList } from 'app/blog/shared/fetchBlogArticlesList'
import { fetchSections } from 'app/blog/shared/fetchSections'
import { ALPHABET } from '@shared/utils/alphabet'

export const fetchFAQs = async () => {
  return await fetchContentByType('faqArticle')
}

export const fetchGlossaryByTitle = async () => {
  return await unAuthFetch(apiRoutes.content.glossaryBySlug.path)
}

const now = new Date()

export default async function sitemap() {
  const mainSitemap = []
  const staticUrls = [
    '/',
    '/about',
    '/run-for-office',
    '/team',
    '/candidates',
    '/login',
    '/register',
    '/faqs',
    '/privacy',
    '/work-with-us',
    '/contact',
    '/political-terms',
    '/volunteer',
    '/academy',
    '/academy-intro',
    '/info-session',
    '/academy-webinar',
    '/blog',
    '/ads2023',
    '/elections',
  ]

  staticUrls.forEach((url) => {
    mainSitemap.push({
      url: `${APP_BASE}${url}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    })
  })

  const blogArticles = await fetchBlogArticlesList()
  const blogSections = await fetchSections()

  try {
    blogArticles.forEach((article) => {
      mainSitemap.push({
        url: `${APP_BASE}/blog/article/${article.slug}`,
        lastModified: article.publishDate,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    })

    blogSections.forEach((section) => {
      mainSitemap.push({
        url: `${APP_BASE}/blog/section/${section.fields?.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    })
  } catch (e) {
    console.log('error at blog SiteMapXML', e)
  }

  const faqArticles = await fetchFAQs()

  try {
    faqArticles.forEach((article) => {
      mainSitemap.push({
        url: `${APP_BASE}${faqArticleRoute(article)}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } catch (e) {
    console.log('error at faqs SiteMapXML', e)
  }
  ALPHABET.forEach((letter) => {
    mainSitemap.push({
      url: `${APP_BASE}/political-terms/${letter}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  const content = await fetchGlossaryByTitle()

  try {
    Object.keys(content).forEach((slug) => {
      mainSitemap.push({
        url: `${APP_BASE}/political-terms/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } catch (e) {
    console.log('error at glossary SiteMapXML', e)
  }

  return mainSitemap
}
