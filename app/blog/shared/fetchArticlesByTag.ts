import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'
import { Article } from './ArticleSnippet'

export const fetchArticlesByTag = async (tag: string): Promise<Article[]> =>
  await unAuthFetch(`${apiRoutes.content.blogArticle.getByTag.path}`, {
    tag,
  })


