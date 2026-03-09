import { redirect } from 'next/navigation'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Password Reset | GoodParty.org',
  description: 'Password reset for GoodParty.org.',
  slug: '/reset-password',
})
export const metadata = meta

export default function Page() {
  redirect('/login')
}
