interface ElectionResultLayoutProps {
  children: React.ReactNode
}

export default function ElectionResultLayout({
  children,
}: ElectionResultLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white md:bg-muted">
      <main className="flex-1">{children}</main>
    </div>
  )
}
