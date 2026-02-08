import Link from 'next/link'
import Overline from '@shared/typography/Overline'

interface Tag {
  slug: string
  name: string
}

interface ArticleTagsProps {
  tags?: Tag[]
}

export default function ArticleTags({ tags }: ArticleTagsProps): React.JSX.Element | null {
  if (!tags) {
    return null
  }
  return (
    <div>
      <Overline className="my-3">Tags</Overline>
      {tags.map((tag) => (
        <Link
          href={`/blog/tag/${tag.slug}`}
          key={tag.slug}
          className="inline-block rounded-md text-sm py-2 px-4 mb-2 mr-2 bg-indigo-200 no-underline cursor hover:bg-indigo-300 outline-offset-0"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
