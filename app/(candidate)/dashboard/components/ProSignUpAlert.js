import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner';
import { MdChevronRight } from 'react-icons/md';

export const ProSignUpAlert = () => (
  <AlertBanner
    {...{
      title: 'Ready to take the leap and upgrade to pro?',
      message:
        "For just $10 a month, you'll gain access to essential tools such as voter data, campaign management resources, and expert guidance to navigate the complexities of running for office.",
      actionHref: '/dashboard/pro-sign-up',
      actionText: (
        <>
          Upgrade Today
          <MdChevronRight className="ml-2 h-6 w-6" />
        </>
      ),
    }}
  />
);
