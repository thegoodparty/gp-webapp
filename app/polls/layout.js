import { ContactsStatsProvider } from './contexts/ContactsStatsContext'

export default function PollsLayout({ children }) {
  return (
    <ContactsStatsProvider>
      <div className="min-h-screen bg-white md:bg-muted">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ContactsStatsProvider>
  )
}


