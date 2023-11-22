import Pill from '@shared/buttons/Pill';
import H3 from '@shared/typography/H3';
import Link from 'next/link';

export default function ArticleTags({ tags }) {
  if (!tags) {
    return null;
  }
  return (
    <div>
      <H3 className="my-3 mb-3">Tags</H3>
      {tags.map((tag) => (
        <Link href={`/blog/tag/${tag.slug}`} key={tag.slug}>
          <div className="bg-yellow px-3 py-2 text-sm rounded-full mr-2 inline-block font-medium cursor-pointer transition-shadow hover:shadow-md">
            {tag.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
