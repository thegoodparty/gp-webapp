import pageMetaData from 'helpers/metadataHelper'
import { FullContentPage } from '@shared/FullContentPage'
import { fetchContentByType } from 'helpers/fetchHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Privacy Policy | GoodParty.org',
  description:
    'This Privacy Policy explains how GoodParty.org collects, uses, and disclose information that you may provide while visiting our website',
  slug: '/privacy',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  const contentArray = (await fetchContentByType('privacyPage')) as {
    [key: string]: string | number | boolean | object | null
  }[]
  const content = contentArray[0]
  return <FullContentPage content={content} />
}
