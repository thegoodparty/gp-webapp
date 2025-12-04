import UserSnapScript from '@shared/scripts/UserSnapScript'
import { ContactsStatsProvider } from './contexts/ContactsStatsContext'
import { OnboardingProvider } from './contexts/OnboardingContext'

export default async function PollsLayout({ children }) {
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
