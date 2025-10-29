import UserSnapScript from '@shared/scripts/UserSnapScript'

export default function ElectionResultLayout({ children }) {
  return (
    <div className="min-h-screen bg-white md:bg-muted">
      <UserSnapScript />
      <main className="flex-1">{children}</main>
    </div>
  )
}
