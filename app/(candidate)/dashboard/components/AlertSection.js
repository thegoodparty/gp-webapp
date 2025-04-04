'use client'

import { useUser } from '@shared/hooks/useUser'
import { CompleteProSignUpAlert } from './CompleteProSignUpAlert'
import { PendingProSubscriptionAlert } from './PendingProSignUpAlert'
import { DemoAccountWarningAlert } from '../shared/DemoAccountWarningAlert'

export default function AlertSection(props) {
  const [user] = useUser()
  const { metaData: userMetaData } = user || {}
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
