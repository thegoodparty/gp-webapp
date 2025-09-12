import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'

export default function ContactsPageGuard({ children }) {
  return (
    <FeatureFlagGuard flagKey="serve-access" redirectTo="/dashboard">
      {children}
    </FeatureFlagGuard>
  )
}
