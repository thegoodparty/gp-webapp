import slugger from 'slugify'

export const slugify = (text: string | undefined, lowercase?: boolean): string => {
  if (!text) {
    return ''
  }
  if (lowercase) {
    return slugger(text, { lower: true })
  }
  return slugger(text)
}

interface Article {
  title?: string
  [key: string]: unknown
}

export const faqArticleRoute = (article: Article | null | undefined): string => {
  if (!article?.title) {
    return '/'
  }
  const slug = slugify(article.title, true)
  return `/faqs/${slug}`.toLowerCase()
}

