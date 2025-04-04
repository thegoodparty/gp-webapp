import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import SignUpPage from './components/SignUpPage'
import pageMetaData from 'helpers/metadataHelper'
import { fetchCampaignStatus } from 'app/(candidate)/dashboard/shared/candidateAccess'

const meta = pageMetaData({
  title: 'Sign up to GoodParty.org',
  description: 'Sign up to GoodParty.org.',
  slug: '/sign-up',
})
export const metadata = meta

export default async function Page() {
  const user = await getServerUser()
  if (user) {
    const { status, slug } = await fetchCampaignStatus()
    if (status === 'candidate') {
      redirect('/dashboard')
    } else if (slug) {
      redirect(`/onboarding/${slug}/1`)
    } else {
      redirect('/profile')
    }
  }
  return <SignUpPage />
}
