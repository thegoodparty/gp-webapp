import { ReactNode } from 'react'
import { OnboardingProvider } from './contexts/OnboardingContext'

interface PollsLayoutProps {
  children: ReactNode
}

export default function PollsLayout({ children }: PollsLayoutProps) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-white md:bg-muted">
        <main className="flex-1">{children}</main>
      </div>
    </OnboardingProvider>
  )
}
