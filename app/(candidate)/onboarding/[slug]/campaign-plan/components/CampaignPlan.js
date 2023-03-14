import MaxWidth from '@shared/layouts/MaxWidth';
import CampaignAccordion from './CampaignAccordion';
import Hero from './Hero';

export default function CampaignManager(props) {
  return (
    <div className="bg-slate-100 py-8">
      <MaxWidth>
        <Hero />
        <CampaignAccordion {...props} />
      </MaxWidth>
    </div>
  );
}
