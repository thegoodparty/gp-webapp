import { ReactNode } from 'react'
import UserSnapScript from '@shared/scripts/UserSnapScript'
import { OnboardingProvider } from './contexts/OnboardingContext'

interface PollsLayoutProps {
  children: ReactNode
}

export default function PollsLayout({ children }: PollsLayoutProps) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-white md:bg-muted">
        <UserSnapScript />
        <main className="flex-1">{children}</main>
      </div>
    </OnboardingProvider>
  )
}
