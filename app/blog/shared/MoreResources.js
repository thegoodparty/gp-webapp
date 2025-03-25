import MarketingH3 from '@shared/typography/MarketingH3';
import ArticleCard from './ArticleCard';

const resourceLinks = [
  {
    title: 'Campaign Tools',
    imageUrl: '/images/blog/campaign-tools.png',
    summary:
      'Get access to campaign content generators, voter insights, one-on-one support, and more.',
    linkUrl: '/run-for-office',
    imageObjectPosition: 'center 30%',
  },
  {
    title: 'GoodParty.org Community',
    imageUrl: '/images/blog/discord-community.png',
    summary:
      'Connect with other independents, and explore opportunities for volunteering and guest posting.',
    linkUrl: 'https://community.goodparty.org',
    linkTarget: '_blank',
  },
  {
    title: 'Politics Glossary',
    imageUrl: '/images/blog/political-terms.png',
    summary:
      'Explore our collection of definitions to help you understand political terms and jargon.',
    linkUrl: '/political-terms',
  },
];

/**
 * Component to render "More Resources" section on Blog list views
 */
export default function MoreResources() {
  return (
    <>
      <MarketingH3 className="text-center mb-8 mt-16">
        More Resources
      </MarketingH3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {resourceLinks.map((resource, index) => (
          <ArticleCard key={index} {...resource}></ArticleCard>
        ))}
      </div>
    </>
  );
}
