'use client';
import { useRef, useState } from 'react';
import BlackButton from '@shared/buttons/BlackButton';
import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Script from 'next/script';
import CampaignAccordion from './CampaignAccordion';
import CampaignPlanSections from './CampaignPlanSections';
import Hero from './Hero';
import { useReactToPrint } from 'react-to-print';

export default function CampaignPlanPage(props) {
  const [expandAll, setExpandAll] = useState(false);
  const { slug } = props.campaign;
  const printRef = useRef();

  const printCallback = () => {
    setExpandAll(true);
    setTimeout(() => {
      handlePrint();
    }, 1000);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    {
      label: 'Your Campaign Plan',
    },
  ];
  return (
    <div className="bg-slate-100 py-2">
      <MaxWidth>
        <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        <Hero {...props} printCallback={printCallback} />
        <CampaignPlanSections {...props} ref={printRef} expandAll={expandAll} />
        <CampaignAccordion {...props} />
        <div className="text-center mb-8 font-black">
          <a href={`/onboarding/${slug}/dashboard`}>
            <BlackButton>CONTINUE</BlackButton>
          </a>
        </div>
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
