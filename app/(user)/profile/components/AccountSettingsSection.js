'use client';
import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import { SubscriptionPendingCancellationAlert } from 'app/(user)/profile/components/SubscriptionPendingCancellationAlert';
import Paper from '@shared/utils/Paper';
import H2 from '@shared/typography/H2';
import H5 from '@shared/typography/H5';
import { useCampaign } from '@shared/hooks/useCampaign';
import { useUser } from '@shared/hooks/useUser';
import { AccountSettingsButton } from 'app/(user)/profile/components/AccountSettingsButton';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

export const AccountSettingsSection = () => {
  const [user = {}] = useUser();
  const userMetaData = user?.metaData || {};
  const { demoPersona } = userMetaData;
  const [campaign] = useCampaign();
  const { isPro, details = {} } = campaign || {};
  const { subscriptionCancelAt, subscriptionId } = details || {};
  const plan = isPro
    ? 'Candidate PRO'
    : demoPersona
    ? 'Demo'
    : 'Candidate FREE';
  const hideButtonForLimboProUsers = isPro && !Boolean(subscriptionId);

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
            <H5> GoodParty.org - {plan} </H5>
            <Body2 className="mt-2 text-gray-600">
              Need help?
              <Link
                className="ml-1 underline text-info-main"
                href="/contact"
                onClick={() =>
                  trackEvent(EVENTS.Settings.Account.ClickSendEmail)
                }
              >
                Send us an email.
              </Link>
            </Body2>
          </div>
          {hideButtonForLimboProUsers ? null : (
            <AccountSettingsButton
              isPro={isPro}
              isDemo={Boolean(demoPersona)}
            />
          )}
        </div>
      </Paper>
    </Paper>
  );
};
