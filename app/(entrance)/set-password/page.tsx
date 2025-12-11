import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import SetPasswordPage from './components/SetPasswordPage'
import pageMetaData from 'helpers/metadataHelper'
import { isValidEmail } from 'helpers/validations'

const meta = pageMetaData({
  title: 'Set Password | GoodParty.org',
  description: 'Set Password GoodParty.org.',
  slug: '/set-password',
})
export const metadata = meta

interface PageProps {
  searchParams: {
    email?: string
    token?: string
  }
}

export default async function Page({ searchParams }: PageProps) {
  const user = await getServerUser()
  if (user) {
    redirect('/profile')
  }

  const { email: encodedEmail, token } = searchParams
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : undefined

  if (!email || !token) {
    redirect('/forgot-password')
  }

  if (!isValidEmail(email)) {
    redirect('/login')
  }

  return <SetPasswordPage email={email} token={token} />
}
