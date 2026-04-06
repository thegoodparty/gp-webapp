import pageMetaData from 'helpers/metadataHelper'
import { redirect } from 'next/navigation'
import { getMarketingUrl } from 'helpers/linkhelper'

const meta = pageMetaData({
  title: 'Terms of Service | GoodParty.org',
  slug: '/terms-of-service',
})
export const metadata = meta

export default function Page() {
  redirect(getMarketingUrl('/terms-of-service'))
}
