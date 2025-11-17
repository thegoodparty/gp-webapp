import slugger from 'slugify'

export const slugify = (
  text: string | undefined,
  lowercase?: boolean,
): string => {
  if (!text) {
    return ''
  }
  if (lowercase) {
    return slugger(text, { lower: true })
  }
  return slugger(text)
}

export const faqArticleRoute = (
  articleTitle: string | null | undefined,
): string => {
  if (!articleTitle) {
    return '/'
  }
  const slug = slugify(articleTitle, true)
  return `/faqs/${slug}`.toLowerCase()
}
