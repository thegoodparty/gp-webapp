import Link from 'next/link'
import Image from 'next/image'
import MarketingH5 from '@shared/typography/MarketingH5'
import Body1 from '@shared/typography/Body1'
import { MdArrowForward } from 'react-icons/md'

export default function ArticleCard({
  title,
  summary,
  imageUrl,
  imageAlt,
  linkUrl,
  linkTarget,
  showReadMoreButton,
  imageObjectPosition,
}) {
  return (
    <Link
      href={linkUrl}
      target={linkTarget}
      className={`inline-flex flex-col no-underline rounded-md overflow-hidden border-[1px] border-color-indigo-200 bg-white ${
        showReadMoreButton ? 'group' : 'hover:bg-indigo-100'
      }`}
    >
      <div className="min-h-[195px] relative">
        <Image
          style={{
            objectFit: 'cover',
            objectPosition: imageObjectPosition || 'center',
          }}
          key={title}
          src={imageUrl}
          alt={imageAlt || title}
          fill
        />
      </div>
      <div className="grow p-6 flex flex-col justify-between">
        <MarketingH5 className="mb-2">{title}</MarketingH5>
        <Body1 className="text-gray-600 line-clamp-2 text-ellipsis">
          {summary}
        </Body1>
        {showReadMoreButton && (
          <button className="self-end inline-flex items-center py-3 px-6 mt-6 text-dark rounded-md group-hover:bg-indigo-700/[0.08]">
            Read more <MdArrowForward className="ml-2 text-2xl" />
          </button>
        )}
      </div>
    </Link>
  )
}
