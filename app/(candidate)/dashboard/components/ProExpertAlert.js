import { AlertBanner } from 'app/(candidate)/dashboard/components/AlertBanner';
import { MdChevronRight } from 'react-icons/md';

export const ProExpertAlert = () => (
  <AlertBanner
    {...{
      title: 'Talk to a Political Expert!',
      message: 'Maximize your impact with personalized advice.',
      actionHref: '/pro-consultation',
      severity: 'success',
      actionText: 'Schedule Call Today',
    }}
  />
);
