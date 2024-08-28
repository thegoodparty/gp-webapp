import Image from 'next/image';
import { dateUsHelper } from 'helpers/dateHelper';

/**
 * @typedef {Object} BlogAuthorProps
 * @property {string} imageUrl URL for author's image
 * @property {string} name Display name for author
 * @property {string} summary Summary for author (only for footer style)
 * @property {Date | string | number} publishDate date to display as published date (only for default style)
 * @property {Date | string | number} updateDate date to display as updated date (only for default style)
 * @property {boolean} asFooter render as blog article footer
 */

/**
 * Render author card for blog posts
 * @param {BlogAuthorProps} props
 */
export default function BlogAuthor({
  name,
  imageUrl,
  summary,
  publishDate,
  updateDate,
  asFooter = false,
}) {
  if (asFooter) {
    // Footer style
    return (
      <div className="flex items-center gap-x-3 py-8">
        <div>
          {imageUrl && (
            <div className="relative w-20 rounded">
              <Image
                style={{
                  'object-fit': 'cover',
                  'object-position': 'top center',
                  'border-radius': '10px',
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
          <p className="font-medium text-lg mb-2">{name}</p>
          <p className="font-sfpro text-gray-600 font-light text-sm">
            {summary}
          </p>
        </div>
      </div>
    );
  }

  // "Card" style
  return (
    <div className="flex gap-x-6 mb-12 mt-8">
      <div className="relative w-15 rounded">
        {imageUrl && (
          <Image
            style={{
              'object-fit': 'cover',
              'object-position': 'top center',
              'border-radius': '50%',
            }}
            src={`https:${imageUrl}`}
            alt={name}
            width={60}
            height={60}
          />
        )}
      </div>
      <div>
        <p className="font-medium text-lg mb-2">{name}</p>
        <p className="font-sfpro text-gray-600 font-light text-sm">
          Published: {dateUsHelper(publishDate)}
          {updateDate && (
            <>
              <br />
              Updated: {dateUsHelper(updateDate)}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
