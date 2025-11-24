import { faqArticleRoute } from 'helpers/articleHelper'
import { notFound, permanentRedirect } from 'next/navigation'
import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

const fetchArticle = async (id) => {
  return await unAuthFetch(`${apiRoutes.content.byId.path}/${id}`)
}

export default async function Page({ params }) {
  const { titleId } = await params
  const id = titleId?.length > 1 ? titleId[1] : false

  // If no ID is provided, this is likely a malformed old URL
  if (!id) {
    notFound()
  }

  const content = await fetchArticle(id)

  if (!content) {
    notFound()
  }

  // Always redirect old URL format to new clean URL format
  const newRoute = faqArticleRoute(content.title)
  permanentRedirect(newRoute)
}
