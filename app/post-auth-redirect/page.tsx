import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchCampaignStatus } from 'app/(candidate)/dashboard/shared/candidateAccess'

export default async function PostAuthRedirect() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  const { status, slug } = await fetchCampaignStatus()
  if (status === 'candidate') {
    redirect('/dashboard')
  } else if (slug) {
    redirect(`/onboarding/${slug}/1`)
  } else {
    redirect('/profile')
  }
}
