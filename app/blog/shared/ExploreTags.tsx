'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import MarketingH5 from '@shared/typography/MarketingH5'

interface Tag {
  name: string
  slug: string
}

interface ExploreTagsProps {
  tags: Tag[]
}

export default function ExploreTags({ tags }: ExploreTagsProps): React.JSX.Element | null {
  const params = useParams<{ tag?: string }>()
  const selectedTag = params?.tag

  if (!Array.isArray(tags)) return null

  return (
    <div className="px-12 py-8 rounded-xl bg-indigo-100">
      <MarketingH5 className="mb-8">Explore all Topics</MarketingH5>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ name, slug }) => (
          <Link
            key={name + slug}
            href={`/blog/tag/${slug}`}
            className={`inline-block py-2.5 px-4 rounded-md outline-offset-0 focus-visible:outline-primary-dark/40 ${
              selectedTag === slug
                ? 'text-white bg-purple-500 hover:bg-purple-700'
                : 'bg-white hover:bg-indigo-200 '
            }`}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  )
}
