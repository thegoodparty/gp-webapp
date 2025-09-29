export default function PollsLayout({ children }) {
  return (
    <div className="min-h-screen bg-white md:bg-muted">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}


