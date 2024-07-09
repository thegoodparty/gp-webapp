import { DashboardAlertBanner } from 'app/(candidate)/dashboard/components/DashboardAlertBanner';

export const ProSignUpAlert = () => (
  <DashboardAlertBanner
    {...{
      title: 'Ready to take the leap and upgrade to pro?',
      message:
        "For just $10 a month, you'll gain access to essential tools such as voter data, campaign management resources, and expert guidance to navigate the complexities of running for office.",
      actionHref: '/dashboard/pro-sign-up',
      actionText: 'Upgrade Today',
    }}
  />
);
