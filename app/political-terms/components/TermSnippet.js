import { slugify } from 'helpers/articleHelper';
import Link from 'next/link';

export const termLink = (term) =>
  `/political-terms/${slugify(term?.title, true)}`;

export default function TermSnippet({ item, last }) {
  const { title, description } = item;
  let truncated = description;
  let isTruncated = false;
  if (description?.length > 150) {
    truncated = description.substring(0, 150);
    isTruncated = true;
  }
  return (
    <Link href={termLink(item)}>
      <div
        className="text-lg lg:flex  pb-4 mb-4 border-b border-b-neutral-300"
        style={last ? { border: 'none' } : {}}
      >
        <h3 className="mb-1 lg:mb-0 lg:basis-1/3">
          <strong>{title}</strong>
        </h3>
        <div className="leading-8">
          {truncated}
          {isTruncated && '...'}
        </div>
      </div>
    </Link>
  );
}
