import Link from 'next/link';
import Overline from '@shared/typography/Overline';

export default function ArticleTags({ tags }) {
  if (!tags) {
    return null;
  }
  return (
    <div>
      <Overline className="my-3">Tags</Overline>
      {tags.map((tag) => (
        <Link
          href={`/blog/tag/${tag.slug}`}
          key={tag.slug}
          className="rounded-md text-sm py-2 px-4 mr-2 bg-indigo-200 no-underline cursor hover:bg-indigo-300"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
