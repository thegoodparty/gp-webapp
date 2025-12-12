import pageMetaData from 'helpers/metadataHelper'
import { FullContentPage } from '@shared/FullContentPage'
import { fetchContentByType } from 'helpers/fetchHelper'
import { Document } from '@contentful/rich-text-types'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Terms of Service | GoodParty.org',
  description: 'Terms of Service for GoodParty.org',
  slug: '/terms-of-service',
})
export const metadata = meta

interface ContentPageData {
  title?: string
  lastModified?: string
  pageContent?: string | Document
}

export default async function Page(): Promise<React.JSX.Element> {
  const contentArray = await fetchContentByType('termsOfService') as ContentPageData[]
  const content = contentArray[0]
  return <FullContentPage content={content} />
}
