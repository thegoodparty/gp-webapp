import { ContactsStatsProvider } from './contexts/ContactsStatsContext'
import { OnboardingProvider } from './contexts/OnboardingContext'

export default function PollsLayout({ children }) {
  return (
    <ContactsStatsProvider>
      <OnboardingProvider>
        <div className="min-h-screen bg-white md:bg-muted">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </OnboardingProvider>
    </ContactsStatsProvider>
  )
}


