import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Hero from './Hero';
import Resources from './Resources';
import SocialList from './SocialList';
import UpdateCampaignSocial from './UpdateCampaignSocial';

export default function OnboardingSocialPage({ campaign }) {
  const { slug } = campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/dashboard`, label: 'Dashboard' },
    {
      label: 'Online presence & social media',
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
        <SocialList slug={slug} />

        <Resources />
        <UpdateCampaignSocial campaign={campaign} />
      </MaxWidth>
    </div>
  );
}
