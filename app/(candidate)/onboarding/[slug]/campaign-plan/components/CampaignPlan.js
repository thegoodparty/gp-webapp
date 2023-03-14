import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import CampaignAccordion from './CampaignAccordion';
import Hero from './Hero';

export default function CampaignManager(props) {
  const { slug } = props.campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    {
      label: 'Your Campaign Plan',
    },
  ];
  return (
    <div className="bg-slate-100 py-2">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} />
        <Hero />
        <CampaignAccordion {...props} />
      </MaxWidth>
    </div>
  );
}
