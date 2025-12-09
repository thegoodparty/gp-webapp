import { ReactNode } from 'react'
import pageMetaData from 'helpers/metadataHelper'
import PollWelcomePage from './components/PollWelcomePage'
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess'
import { requireAuth } from 'helpers/authHelper'
import { hasPolls } from 'app/(candidate)/dashboard/polls/shared/serverApiCalls'
import { redirect } from 'next/navigation'

const meta = pageMetaData({
  title: 'Welcome to GoodParty.org Serve',
  description: 'Welcome to GoodParty.org Serve',
  slug: '/polls/welcome',
})

export const metadata = meta

export default async function Page(): Promise<ReactNode> {
  await requireAuth()
  await candidateAccess()

  const hasPollsResponse = await hasPolls()

  // If the user has polls, disallow onboarding and redirect to the dashboard polls page
  if (hasPollsResponse?.hasPolls) {
    return redirect('/dashboard/polls')
  }

  return <PollWelcomePage />
}
