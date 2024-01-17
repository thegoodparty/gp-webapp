import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import Hero from './Hero';
import Resources from './Resources';
import SocialList from './SocialList';
import UpdateCampaignSocial from './UpdateCampaignSocial';

const cards = [
  {
    title: 'Mastering Political Social Media',
    description:
      'How to create a social media plan, engage with followers, handle negative feedback, and measure success.',
    link: '/blog/article/mastering-social-media-content-for-your-campaign',
  },
  {
    title: 'Building a Strong Political Brand on...',
    description:
      'Practical advice on how to create a compelling and consistent political brand.',
    link: '/blog/article/getting-verified-to-run-political-ads-on-facebook',
  },
  {
    title: 'A Step-by-Step Guide to Getting...',
    description:
      'How you can request and obtain verification on social media platforms',
    link: '/blog/article/creating-content-to-generate-fundraising-and-volunteers',
  },
];

export default function OnboardingSocialPage({ campaign }) {
  const { slug } = campaign;
  const breadcrumbsLinks = [
    { href: `/onboarding/${slug}/1`, label: 'Dashboard' },
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
        <Hero title="Online presence & social media" />
        <div className="lg:hidden">
          <Breadcrumbs links={breadcrumbsLinks} withRefresh />
        </div>
        <SocialList slug={slug} />

        <Resources cards={cards} />
        <UpdateCampaignSocial campaign={campaign} />
      </MaxWidth>
    </div>
  );
}
