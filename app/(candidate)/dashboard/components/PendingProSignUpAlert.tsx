import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'

export const PendingProSubscriptionAlert = (): React.JSX.Element => (
  <AlertBanner
    title="Subscription Pending"
    message="Please be patient while we process your subscription. You will receive an email confirmation once your subscription is active."
  />
)
