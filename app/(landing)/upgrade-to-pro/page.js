import { redirect } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'

export const revalidate = 3600
export const dynamic = 'force-static'

const meta = pageMetaData({
  title: 'Upgrade to Pro',
  description: 'Request to meet with our team to upgrade to GoodParty.org Pro',

  slug: '/pro-consultation',
  image: 'https://assets.goodparty.org/get-a-demo.png',
})
export const metadata = meta

export default async function Page() {
  redirect('/dashboard/upgrade-to-pro')
}
