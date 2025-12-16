'use client'

import { useUser } from '@shared/hooks/useUser'
import { CompleteProSignUpAlert } from './CompleteProSignUpAlert'
import { PendingProSubscriptionAlert } from './PendingProSignUpAlert'
import { DemoAccountWarningAlert } from '../shared/DemoAccountWarningAlert'

interface UserMetaData {
  checkoutSessionId?: string
  customerId?: string
  demoPersona?: string
}

interface User {
  metaData?: UserMetaData
}

interface CampaignDetails {
  subscriptionId?: string
}

interface Campaign {
  isPro?: boolean
  details?: CampaignDetails
}

interface AlertSectionProps {
  campaign: Campaign
}

export default function AlertSection(props: AlertSectionProps): React.JSX.Element {
  const [user] = useUser()
  const { metaData: userMetaData } = (user as User) || {}
  const { checkoutSessionId, customerId, demoPersona } = userMetaData || {}

  const { campaign } = props
  const { isPro, details } = campaign
  const { subscriptionId } = details || {}

  const startedProCheckout =
    checkoutSessionId && !customerId && !subscriptionId
  const subscriptionPending =
    checkoutSessionId && customerId && !subscriptionId

  const showCompleteProSignUpAlert = startedProCheckout
  const showSubscriptionPendingAlert = subscriptionPending

  return (
    <div>
      {!isPro && !demoPersona && (
        <>
          {showCompleteProSignUpAlert && <CompleteProSignUpAlert />}
          {showSubscriptionPendingAlert && <PendingProSubscriptionAlert />}
        </>
      )}
      {demoPersona && <DemoAccountWarningAlert />}
    </div>
  )
}
