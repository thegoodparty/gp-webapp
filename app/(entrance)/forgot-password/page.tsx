import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Forgot Password | GoodParty.org',
  description: 'Password retrieval for GoodParty.org.',
  slug: '/forgot-password',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  const user = await getServerUser()
  if (user) {
    redirect('/profile')
  }

  return <ForgotPasswordPage />
}

