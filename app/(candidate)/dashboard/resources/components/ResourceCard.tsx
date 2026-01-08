'use client'
import Link from 'next/link'
import Image from 'next/image'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface ResourceCardProps {
  id: string
  title: string
  url: string
  category: string
  imageUrl?: string
}

const ResourceCard = ({ id, title, url, category, imageUrl }: ResourceCardProps): React.JSX.Element => {
  const handleClick = (): void => {
    trackEvent(EVENTS.Resources.ResourceClicked, {
      resourceName: title,
      resourceUrl: url,
      resourceCategory: category,
    })
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="
        flex
        flex-col
        gap-1
        items-start
        w-full
        md:w-[180px]
      "
      id={id}
    >
      {imageUrl && (
        <div
          className="
            w-full
            rounded-lg
            overflow-hidden
            md:w-[180px]
          "
        >
          <div
            className="
              relative
              w-full
            "
            style={{ paddingBottom: '66.67%' }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 180px"
              className="
                absolute
                inset-0
                object-cover
                rounded-lg
              "
            />
          </div>
        </div>
      )}
      <p
        className="
          font-normal
          text-sm
          leading-5
          text-[#1e1f20]
          w-full
          md:w-[180px]
        "
      >
        {title}
      </p>
    </Link>
  )
}

export default ResourceCard
