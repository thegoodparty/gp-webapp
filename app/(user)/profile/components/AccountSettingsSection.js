'use client';
import { FiSettings } from 'react-icons/fi';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import { MdOpenInNew } from 'react-icons/md';
import { PaymentPortalButton } from '@shared/PaymentPortalButton';
import H6 from '@shared/typography/H6';
import { SubscriptionPendingCancellationAlert } from 'app/(user)/profile/components/SubscriptionPendingCancellationAlert';
import Paper from '@shared/utils/Paper';
import H2 from '@shared/typography/H2';
import H5 from '@shared/typography/H5';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export const AccountSettingsSection = ({ isPro, subscriptionCancelAt }) => {
  const plan = isPro ? 'Pro plan' : 'Free plan';
  return (
    <Paper className="mt-4">
      <H2>Account Settings</H2>
      <Body2 className="text-gray-600 mb-8">
        See information regarding your current plan.
      </Body2>

      <H4>Current Plan</H4>
      <Body2 className="text-gray-600 mb-4">Manage and change your plan.</Body2>
      {isPro && subscriptionCancelAt && (
        <SubscriptionPendingCancellationAlert
          subscriptionCancelAt={subscriptionCancelAt}
        />
      )}
      <Paper>
        <div className="flex justify-between">
          <div>
            <H5> Good Party - {plan} </H5>
            <Body2 className="mt-4">
              Need help? Please{' '}
              <Link className="underline" href="/contact">
                Contact us
              </Link>
            </Body2>
          </div>
          {!isPro ? (
            <div>
              <Link className="underline" href="/dashboard/pro-sign-up">
                <PrimaryButton>Upgrade Plan</PrimaryButton>
              </Link>
            </div>
          ) : (
            <PaymentPortalButton>
              Manage Subscription
              <MdOpenInNew className="ml-2" />
            </PaymentPortalButton>
          )}
        </div>
      </Paper>
    </Paper>
  );
};
