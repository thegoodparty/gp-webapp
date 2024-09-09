import Body1 from '@shared/typography/Body1';
import MarketingH3 from '@shared/typography/MarketingH3';
import MarketingH5 from '@shared/typography/MarketingH5';
import Image from 'next/image';
import Link from 'next/link';

const resourceLinks = [
  {
    title: 'Campaign Tools',
    imageUrl: '/images/blog/campaign-tools.png',
    summary:
      'Get access to campaign content generators, voter insights, one-on-one support, and more.',
    url: '/run-for-office',
    objectPosition: 'center 30%',
  },
  {
    title: 'Discord Community',
    imageUrl: '/images/blog/discord-community.png',
    summary:
      'Connect with other independents, and explore opportunities for volunteering and guest posting.',
    url: 'https://discord.gg/invite/goodparty',
    target: '_blank',
  },
  {
    title: 'Politics Glossary',
    imageUrl: '/images/blog/political-terms.png',
    summary:
      'Explore our collection of definitions to help you understand political terms and jargon.',
    url: '/political-terms',
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
        {resourceLinks.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            target={item.target}
            className="no-underline rounded-md overflow-hidden border-[1px] border-color-indigo-200 hover:bg-indigo-100"
          >
            <div className="min-h-[195px] relative">
              <Image
                style={{
                  objectFit: 'cover',
                  objectPosition: item.objectPosition || 'center',
                }}
                key={item.title}
                src={item.imageUrl}
                alt={item.title}
                fill
              />
            </div>
            <div className="p-6">
              <MarketingH5 className="mb-2">{item.title}</MarketingH5>
              <Body1 className="text-gray-600">{item.summary}</Body1>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
