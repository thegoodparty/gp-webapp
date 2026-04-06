import pageMetaData from 'helpers/metadataHelper'
import { redirect } from 'next/navigation'
import { getMarketingUrl } from 'helpers/linkhelper'

const meta = pageMetaData({
  title: 'Privacy Policy | GoodParty.org',
  description:
    'This Privacy Policy explains how GoodParty.org collects, uses, and disclose information that you may provide while visiting our website',
  slug: '/privacy',
})
export const metadata = meta

export default function Page() {
  redirect(getMarketingUrl('/privacy'))
}
