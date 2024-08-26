import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner';
import { MdChevronRight } from 'react-icons/md';

export const ProSignUpAlert = () => (
  <AlertBanner
    {...{
      title: 'Need Additional Support?',
      message:
        'We have your back. Get voter data, 24/7 access to experts, and more for just $10/mo.',
      actionHref: '/dashboard/pro-sign-up',
      actionText: (
        <div className="flex items-center" id="pro_upgrade_alert">
          Upgrade Today
          <MdChevronRight className="ml-1" size={24} />
        </div>
      ),
    }}
  />
);
