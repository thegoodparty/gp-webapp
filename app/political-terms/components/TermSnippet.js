import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import { slugify } from 'helpers/articleHelper';
import contentfulHelper from 'helpers/contentfulHelper';
import Link from 'next/link';

export const termLink = (term) =>
  `/political-terms/${slugify(term?.title, true)}`;

export default function TermSnippet({ item, last }) {
  const { title, description } = item;

  return (
    <Link href={termLink(item)}>
      <div
        className="text-lg lg:flex  pb-4 mb-4 border-b border-b-neutral-300"
        style={last ? { border: 'none' } : {}}
      >
        <h3 className="mb-1 lg:mb-0 lg:basis-1/3">
          <strong>{title}</strong>
        </h3>
        <div
          className="leading-8 max-h-16 block w-full overflow-hidden"
          style={{
            display: '-webkit-box',
            '-webkit-line-clamp': '3',
            '-webkit-box-orient': 'vertical',
            'text-overflow': 'ellipsis',
          }}
        >
          <CmsContentWrapper>{contentfulHelper(description)}</CmsContentWrapper>
        </div>
      </div>
    </Link>
  );
}
