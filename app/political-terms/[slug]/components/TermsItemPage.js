import BlackButton from '@shared/buttons/BlackButton';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import MaxWidth from '@shared/layouts/MaxWidth';
import Breadcrumbs from '@shared/utils/Breadcrumbs';
import contentfulHelper from 'helpers/contentfulHelper';
import Link from 'next/link';
import TermsByLetter from '../../components/TermsByLetter';

export default function TermsItemPage({ item, slug, items, activeLetter }) {
  const letter = slug.charAt(0).toUpperCase();
  const breadcrumbsLinks = [
    { href: '/', label: 'Good Party' },

    {
      href: '/political-terms',
      label: 'Glossary',
    },
    {
      href: `/political-terms/${letter}`,
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
  const { title, description, cta, ctaLink } = item;
  const isAbsolute = ctaLink && ctaLink.startsWith('http');
  return (
    <MaxWidth>
      <div className="mt-2">
        <Breadcrumbs links={breadcrumbsLinks} />
      </div>

      <div className="my-7 lg:my-14">
        <h1 className="font-black text-4xl lg:text-5xl mb-4">{title}</h1>
        <div className="text-lg mb-6">
          <CmsContentWrapper>{contentfulHelper(description)}</CmsContentWrapper>
        </div>
        {cta && ctaLink && (
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
      </div>
      {activeLetter != undefined && (
        <TermsByLetter
          letter={letter}
          items={items}
          activeLetter={activeLetter}
        />
      )}
    </MaxWidth>
  );
}
