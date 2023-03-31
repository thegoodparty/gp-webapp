'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Script from 'next/script';
import CampaignAccordion from './CampaignAccordion';
import CampaignPlanSections from './CampaignPlanSections';
import Hero from './Hero';

export default function CampaignPlanPage(props) {
  const { slug } = props.campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    { href: `/onboarding/${slug}/dashboard/1`, label: 'Pre-Launch' },
    {
      label: 'Your Campaign Plan',
    },
  ];
  return (
    <div className="bg-slate-100 py-2">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        <Hero />
        <CampaignPlanSections {...props} />
        <CampaignAccordion {...props} />
      </MaxWidth>
      <Script
        type="text/javascript"
        id="hs-script-loader"
        strategy="afterInteractive"
        src="//js.hs-scripts.com/21589597.js"
      />
    </div>
  );
}
