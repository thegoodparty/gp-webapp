import pageMetaData from 'helpers/metadataHelper'
import { FullContentPage } from '@shared/FullContentPage'
import { fetchContentByType } from 'helpers/fetchHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Terms of Service | GoodParty.org',
  slug: '/terms-of-service',
})
export const metadata = meta

export default async function Page() {
  const content = (await fetchContentByType('termsOfService'))[0]
  return <FullContentPage content={content} />
}
