import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Hero from './Hero';
import Resources from './Resources';
import TeamList from './TeamList';
import UpdateCampaignTeam from './UpdateCampaignTeam';

export default function OnboardingTeamPage({ campaign }) {
  const { slug } = campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
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
        <Hero />
        <div className="lg:hidden">
          <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        </div>
        <TeamList slug={slug} />

        <Resources />
        <UpdateCampaignTeam campaign={campaign} />
      </MaxWidth>
    </div>
  );
}
