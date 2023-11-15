import BlackButton from '@shared/buttons/BlackButton';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import contentfulHelper from 'helpers/contentfulHelper';
import Link from 'next/link';
import TermsByLetter from '../../components/TermsByLetter';
import Banner from '/app/blog/article/[slug]/components/Banner';

export default function TermsItemPage({ item, items, activeLetter }) {
  const letter = activeLetter;
  const breadcrumbsLinks = [
    { href: '/', label: 'Good Party' },

    {
      href: '/political-terms',
      label: 'Glossary',
    },
    {
      href: `/political-terms/${letter.toLowerCase()}`,
      label: letter,
    },
    {
      label: item ? item.title : 'Not found',
    },
  ];
  if (!item) {
    return (
      <MaxWidth>
        <div className="my-9 lg:my-16">
          <h1 className="font-black text-4xl lg:text-5xl mb-4">
            No Item found
          </h1>
        </div>
      </MaxWidth>
    );
  }
  const { title, description, cta, ctaLink, banner } = item;
  const isAbsolute = ctaLink && ctaLink.startsWith('http');
  return (
    <MaxWidth>
      <div className="mt-2">
        <Breadcrumbs links={breadcrumbsLinks} />
      </div>

      <div className="my-7 lg:my-14">
        <h1 className="font-black text-4xl lg:text-5xl mb-4">
          What is {title}?
        </h1>
        <div className="text-lg mb-6">
          <CmsContentWrapper>{contentfulHelper(description)}</CmsContentWrapper>
        </div>
        {cta && ctaLink && !banner && (
          <>
            {isAbsolute ? (
              <a
                href={ctaLink}
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                <BlackButton>{cta}</BlackButton>
              </a>
            ) : (
              <Link href={ctaLink}>
                <BlackButton>
                  <strong>{cta}</strong>
                </BlackButton>
              </Link>
            )}
          </>
        )}

        {banner && <Banner banner={banner} />}
      </div>
      {activeLetter && (
        <TermsByLetter
          letter={letter}
          items={items}
          activeLetter={activeLetter}
        />
      )}
    </MaxWidth>
  );
}
