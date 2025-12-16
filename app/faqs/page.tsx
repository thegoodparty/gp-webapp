import { unAuthFetch } from 'gpApi/unAuthFetch'
import FaqsPage from './components/FaqsPage'
import pageMetaData from 'helpers/metadataHelper'
import { apiRoutes } from 'gpApi/routes'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'FAQs | GoodParty.org',
  description: 'Frequently Asked Questions about GoodParty.org.',
  slug: '/faqs',
})
export const metadata = meta

interface Article {
  id: number | string
  title: string
}

interface CategoryFields {
  name: string
}

interface Category {
  id: number | string
  fields: CategoryFields
  articles?: Article[]
}

const fetchContent = async (): Promise<Category[]> => {
  return await unAuthFetch(
    `${apiRoutes.content.byType.path}/articleCategories`,
  )
}

export default async function Page(): Promise<React.JSX.Element> {
  const content = await fetchContent()
  const childProps = {
    content,
  }
  return <FaqsPage {...childProps} />
}
