'use client'

import { useUser } from '@shared/hooks/useUser'
import { CompleteProSignUpAlert } from './CompleteProSignUpAlert'
import { PendingProSubscriptionAlert } from './PendingProSignUpAlert'
import { Campaign } from 'helpers/types'

interface AlertSectionProps {
  campaign: Campaign
}

export default function AlertSection(
  props: AlertSectionProps,
): React.JSX.Element {
  const [user] = useUser()
  const { metaData: userMetaData } = user || {}
  const { checkoutSessionId, customerId } = userMetaData || {}

  const { campaign } = props
  const { isPro, details } = campaign
  const { subscriptionId } = details || {}

  const startedProCheckout = checkoutSessionId && !customerId && !subscriptionId
  const subscriptionPending = checkoutSessionId && customerId && !subscriptionId

  const showCompleteProSignUpAlert = startedProCheckout
  const showSubscriptionPendingAlert = subscriptionPending

  return (
    <div>
      {!isPro && (
        <>
          {showCompleteProSignUpAlert && <CompleteProSignUpAlert />}
          {showSubscriptionPendingAlert && <PendingProSubscriptionAlert />}
        </>
      )}
    </div>
  )
}
