import Image from 'next/image'
import { dateUsHelper } from 'helpers/dateHelper'
import H4 from '@shared/typography/H4'
import Body2 from '@shared/typography/Body2'

/**
 * @typedef {Object} BlogAuthorProps
 * @property {string} imageUrl URL for author's image
 * @property {string} name Display name for author
 * @property {Date | string | number} publishDate date to display as published date (only for default style)
 * @property {Date | string | number} updateDate date to display as updated date (only for default style)
 */

/**
 * Render author card for blog posts
 * @param {BlogAuthorProps} props
 */
export default function BlogAuthor({
  name,
  imageUrl,
  publishDate,
  updateDate,
}) {
  return (
    <div className="flex gap-x-6 mb-12 mt-8" data-testid="blogAuthor">
      <div className="relative w-15 rounded">
        {imageUrl && (
          <Image
            style={{
              objectFit: 'cover',
              objectPosition: 'top center',
              borderRadius: '50%',
            }}
            src={`https:${imageUrl}`}
            alt={name}
            width={60}
            height={60}
          />
        )}
      </div>
      <div>
        <H4 className="mb-2">{name}</H4>
        <Body2 className="text-gray-600">
          Published: {dateUsHelper(publishDate)}
          {updateDate && (
            <>
              <br />
              Updated: {dateUsHelper(updateDate)}
            </>
          )}
        </Body2>
      </div>
    </div>
  )
}
