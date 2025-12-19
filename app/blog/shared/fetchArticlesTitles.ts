import { fetchContentByType } from 'helpers/fetchHelper'

interface ArticleTitle {
  title: string
  slug: string
}

export const fetchArticlesTitles = async (): Promise<ArticleTitle[]> =>
  await fetchContentByType<ArticleTitle[]>('blogArticleTitles')
