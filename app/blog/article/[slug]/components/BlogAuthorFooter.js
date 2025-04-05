import Image from 'next/image'
import Body2 from '@shared/typography/Body2'
import H4 from '@shared/typography/H4'

/**
 * @typedef {Object} BlogAuthorProps
 * @property {string} imageUrl URL for author's image
 * @property {string} name Display name for author
 * @property {string} summary Summary for author
 */

/**
 * Render author card for blog posts
 * @param {BlogAuthorProps} props
 */
export default function BlogAuthorFooter({ name, imageUrl, summary }) {
  return (
    <div className="flex items-center gap-x-3 py-8">
      <div>
        {imageUrl && (
          <div className="relative w-20 rounded">
            <Image
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '10px',
              }}
              src={`https:${imageUrl}`}
              alt={name}
              width={80}
              height={80}
            />
          </div>
        )}
      </div>
      <div>
        <H4 className="mb-2">{name}</H4>
        <Body2 className="text-gray-600">{summary}</Body2>
      </div>
    </div>
  )
}
