import { DashboardAlertBanner } from 'app/(candidate)/dashboard/components/DashboardAlertBanner';

export const PendingProSubscriptionAlert = () => (
  <DashboardAlertBanner
    {...{
      title: 'Subscription Pending',
      message:
        'Please be patient while we process your subscription. You will receive an email confirmation once your subscription is active.',
    }}
  />
);
