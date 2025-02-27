import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner';
import { MdChevronRight } from 'react-icons/md';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';

export const ProSignUpAlert = () => (
  <AlertBanner
    {...{
      actionOnClick: () => trackEvent(EVENTS.ProUpgrade.Banner.ClickUpgrade),
      title: 'Level Up Your Campaign',
      message:
        'Access campaign essentials like text banking, voter data, and 1:1 expert support for just $10/month.',
      actionHref: '/dashboard/pro-sign-up',
      actionText: (
        <div
          className="flex items-center justify-center lg:justify-start"
          id="pro_upgrade_alert"
        >
          Upgrade Today
          <MdChevronRight className="ml-1" size={24} />
        </div>
      ),
    }}
  />
);
