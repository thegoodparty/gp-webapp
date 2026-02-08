import { faqArticleRoute } from 'helpers/articleHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

interface Article {
  title: string
}

interface Params {
  titleId?: string[]
}

const fetchArticle = async (id: string): Promise<Article> => {
  return await unAuthFetch(`${apiRoutes.content.byId.path}/${id}`)
}

export default async function Page({ params }: { params: Promise<Params> }): Promise<void> {
  const { titleId } = await params
  const id = titleId?.length && titleId.length > 1 ? titleId[1] : false

  if (!id) {
    notFound()
  }

  const content = await fetchArticle(id)

  if (!content) {
    notFound()
  }

  const newRoute = faqArticleRoute(content.title)
  permanentRedirect(newRoute)
}
