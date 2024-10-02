import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner';
import { MdChevronRight } from 'react-icons/md';

export const ProSignUpAlert = () => (
  <AlertBanner
    {...{
      title: 'Level Up Your Campaign',
      message:
        'Access campaign essentials like text banking, voter data, and 1:1 expert support for just $10/month.',
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
