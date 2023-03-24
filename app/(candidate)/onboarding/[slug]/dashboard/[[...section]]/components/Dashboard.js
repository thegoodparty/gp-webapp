import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Help from './Help';
import Hero from './Hero';
import SectionHero from './SectionHero';
import Steps from './Steps';

export default function Dashboard(props) {
  const { sectionIndex, campaign, campaignSteps } = props;
  const { slug } = campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    {
      label: campaignSteps[sectionIndex]?.title,
    },
  ];
  return (
    <div
      className={`bg-slate-100 min-h-[calc(100vh-80px)] relative pb-16 ${
        sectionIndex === false ? 'pt-8' : 'pt-0'
      }`}
    >
      {sectionIndex !== false ? (
        <MaxWidth>
          <Breadcrumbs links={breadcrumbsLinks} />
          <SectionHero {...props} />
        </MaxWidth>
      ) : (
        <Hero {...props} />
      )}
      <Steps {...props} />
      <Help />
    </div>
  );
}
