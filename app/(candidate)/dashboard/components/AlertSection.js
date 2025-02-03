'use client';

import { useUser } from '@shared/hooks/useUser';
import { ProSignUpAlert } from './ProSignUpAlert';
import { CompleteProSignUpAlert } from './CompleteProSignUpAlert';
import { PendingProSubscriptionAlert } from './PendingProSignUpAlert';
import { DemoAccountWarningAlert } from '../shared/DemoAccountWarningAlert';
import { ProExpertAlert } from './ProExpertAlert';

export default function AlertSection(props) {
  const [user, setUser] = useUser();
  const { metaData: userMetaData } = user || {};
  const { checkoutSessionId, customerId, demoPersona } = userMetaData || {};

  const { campaign } = props;
  const { isPro, details } = campaign;
  const { subscriptionId } = details || {};

  const hasntEnteredProFlow =
    !checkoutSessionId && !customerId && !subscriptionId;
  const startedProCheckout =
    checkoutSessionId && !customerId && !subscriptionId;
  const subscriptionPending =
    checkoutSessionId && customerId && !subscriptionId;

  const showCompleteProSignUpAlert = startedProCheckout;
  const showSubscriptionPendingAlert = subscriptionPending;
  const showProSignUpAlert =
    (hasntEnteredProFlow || !isPro) &&
    !(showCompleteProSignUpAlert || showSubscriptionPendingAlert);

  return (
    <div>
      {!isPro && !demoPersona && (
        <>
          {showProSignUpAlert && <ProSignUpAlert />}
          {showCompleteProSignUpAlert && <CompleteProSignUpAlert />}
          {showSubscriptionPendingAlert && <PendingProSubscriptionAlert />}
        </>
      )}
      {demoPersona && <DemoAccountWarningAlert />}
      {isPro && <ProExpertAlert />}
    </div>
  );
}
