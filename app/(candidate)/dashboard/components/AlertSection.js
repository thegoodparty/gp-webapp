'use client';

import { useUser } from '@shared/hooks/useUser';
import { ProSignUpAlert } from './ProSignUpAlert';
import { CompleteProSignUpAlert } from './CompleteProSignUpAlert';
import { PendingProSubscriptionAlert } from './PendingProSignUpAlert';
import { DemoAccountWarningAlert } from '../shared/DemoAccountWarningAlert';

export default function AlertSection(props) {
  const [user, setUser] = useUser();
  const { metaData: userMetaData } = user || {};
  const { checkoutSessionId, customerId, demoPersona } = JSON.parse(
    userMetaData || '{}',
  );
  const { campaign } = props;
  const { isPro, details } = campaign;
  const { subscriptionId } = details || {};

  const hasntEnteredProFlow =
    !checkoutSessionId && !customerId && !subscriptionId;
  const startedProCheckout =
    checkoutSessionId && !customerId && !subscriptionId;
  const subscriptionPending =
    checkoutSessionId && customerId && !subscriptionId;

  const showProSignUpAlert = hasntEnteredProFlow || !isPro;
  const showCompleteProSignUpAlert = startedProCheckout;
  const showSubscriptionPendingAlert = subscriptionPending;

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
    </div>
  );
}
