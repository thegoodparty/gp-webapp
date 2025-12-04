import UserSnapScript from '@shared/scripts/UserSnapScript'
import { ContactsStatsProvider } from './contexts/ContactsStatsContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import { hasPolls } from 'app/(candidate)/dashboard/polls/shared/serverApiCalls'
import { redirect } from 'next/navigation'

export default async function PollsLayout({ children }) {
  const hasPollsResponse = await hasPolls()

  // If the user has polls, disallow onboarding and redirect to the dashboard polls page
  if (hasPollsResponse?.hasPolls) {
    return redirect('/dashboard/polls')
  }

  return (
    <ContactsStatsProvider>
      <OnboardingProvider>
        <div className="min-h-screen bg-white md:bg-muted">
          <UserSnapScript />
          <main className="flex-1">{children}</main>
        </div>
      </OnboardingProvider>
    </ContactsStatsProvider>
  )
}
