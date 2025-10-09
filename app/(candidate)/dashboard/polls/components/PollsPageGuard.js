import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'

export default function PollsPageGuard({ children }) {
  return (
    <FeatureFlagGuard flagKey="serve-polls-v1">{children}</FeatureFlagGuard>
  )
}
