import BlackButton from '@shared/buttons/BlackButton';
import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import MaxWidth from '@shared/layouts/MaxWidth';
import contentfulHelper from 'helpers/contentfulHelper';
import Link from 'next/link';

export default function TermsItemPage({ item }) {
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
      <div className="my-9 lg:my-16">
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
    </MaxWidth>
  );
}
