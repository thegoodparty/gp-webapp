import { redirect } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Set Password | GoodParty.org',
  description: 'Set Password GoodParty.org.',
  slug: '/set-password',
})
export const metadata = meta

export default function Page() {
  redirect('/login')
}
