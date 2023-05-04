import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Resources from '../../social/components/Resources';
import Hero from '../../social/components/Hero';
import FinanceChecklist from './FinanceChecklist';
const cards = [
  {
    title: 'Raising the Bar: Best Practices for...',
    description: 'Strategies to raise funds effectively and ethically.',
    link: '/blog/article/raising-the-bar-best-practices-for-political-fundraising',
  },
  {
    title: 'Sample Finance Plan',
    description:
      'Template to help you plan, execute, and evaluate your fundraising efforts.',
    link: 'https://docs.google.com/document/d/1UAm-N9nU4JuD-0yaMkQBepFu90bnmyzUQX2wd-BtLLc/edit?usp=sharing',
  },
];

export default function OnboardingFinancePage({ campaign }) {
  const { slug } = campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    {
      label: 'Financial Management & Fundraising',
    },
  ];
  return (
    <div className="bg-slate-100 py-2">
      <MaxWidth>
        <div className="hidden lg:block">
          <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        </div>
        <Hero title="Financial Management & Fundraising" />
        <div className="lg:hidden">
          <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        </div>
        <FinanceChecklist campaign={campaign} />

        <Resources cards={cards} />
      </MaxWidth>
    </div>
  );
}
