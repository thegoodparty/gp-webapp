import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Hero from '../../social/components/Hero';
import Resources from '../../social/components/Resources';
import TeamList from './TeamList';
import UpdateCampaignTeam from './UpdateCampaignTeam';
const cards = [
  {
    title: 'Endorsement Checklist',
    description:
      'Comprehensive checklist ensuring thorough assessment of political endorsements and candidate support.',
    link: 'https://docs.google.com/document/d/1NeREKkd2HfFcrllQbAryy5Cn5FBabtfNsxI-ircv_b4/edit?usp=sharing',
  },
  {
    title: 'Sample Endorsement Pitch',
    description:
      'Example of a persuasive, well-structured pitch for securing endorsements in various contexts',
    link: 'https://docs.google.com/document/d/1Zx_WbrjQogr8ftar2PInxfXuYPvhMFBLwxZ8TTHvc3Y/edit?usp=sharing',
  },
  {
    title: 'Sample Asks of Endorsers',
    description:
      'Examples of requests and expectations for endorsers in political, business, or social contexts.',
    link: 'https://docs.google.com/document/d/1z0K6n5jhxtrYc-TpXnZBUgGGHrwEhrq68ZS1OqEX-54/edit?usp=sharing',
  },
  {
    title: 'Volunteer Checklist',
    description:
      'Essential tasks and reminders for effective volunteer engagement and orientation in organizations.',
    link: 'https://docs.google.com/document/d/16xDjKGHKH8vR80ZELw9QSyW-utu9y6ZFqQa13IAWllU/edit?usp=sharing',
  },
  {
    title: 'Sample Volunteer Sign Up Form',
    description:
      'A useful tool for campaigns to efficiently and effectively collect information from potential volunteers.',
    link: 'https://docs.google.com/document/d/11yUOHQC8KP2O00dx06oJOrPQZ39C2-WWoxhIDaEiJP4/edit?usp=sharing',
  },
  {
    title: 'Sample Volunteer Manual',
    description:
      'Comprehensive guide for volunteers, detailing roles, expectations, and best practices in various organizations.',
    link: 'https://docs.google.com/document/d/1eQ04zEURkCg8retajR03hn8CQSetTfE-rZZKz8u-hYg/edit?usp=sharing',
  },
];

export default function OnboardingTeamPage({ campaign }) {
  const { slug } = campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/1`, label: 'Dashboard' },
    {
      label: 'Build a Campaign Team',
    },
  ];
  return (
    <div className="bg-slate-100 py-2">
      <MaxWidth>
        <div className="hidden lg:block">
          <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        </div>
        <Hero title="Build a Campaign Team" />
        <div className="lg:hidden">
          <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        </div>
        <TeamList slug={slug} />

        <Resources cards={cards} />
        <UpdateCampaignTeam campaign={campaign} />
      </MaxWidth>
    </div>
  );
}
