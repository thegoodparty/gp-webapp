import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner'

export const CompleteProSignUpAlert = (): React.JSX.Element => (
  <AlertBanner
    title="Please complete your pro sign up!"
    message="Please remember to complete your Pro Plan sign up to access all the features and tools available to you!"
    actionHref="/dashboard/pro-sign-up/purchase-redirect"
    actionText="Continue"
  />
)
