import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'

export default function PollsPageGuard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FeatureFlagGuard flagKey="serve-polls-v1">{children}</FeatureFlagGuard>
  )
}
