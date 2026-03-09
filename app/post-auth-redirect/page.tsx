import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchCampaignStatus } from 'app/(candidate)/dashboard/shared/candidateAccess'

export default async function PostAuthRedirect() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/login')
  }

  try {
    const { status, slug } = await fetchCampaignStatus()
    if (status === 'candidate') {
      redirect('/dashboard')
    } else if (slug) {
      redirect(`/onboarding/${slug}/1`)
    } else {
      redirect('/profile')
    }
  } catch (e) {
    // Re-throw redirect errors (they're expected flow control in Next.js)
    if (e && typeof e === 'object' && 'digest' in e) throw e
    console.error('PostAuthRedirect: failed to fetch campaign status', e)
    redirect('/profile')
  }
}
