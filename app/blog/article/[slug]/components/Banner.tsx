import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import MarketingH5 from '@shared/typography/MarketingH5'
import Image from 'next/image'

interface BannerImage {
  url?: string
  alt?: string
  size?: {
    width?: number
    height?: number
  }
}

interface BannerData {
  title?: string
  description?: string
  buttonLabel?: string
  buttonLink?: string
  smallImage?: BannerImage
  largeImage?: BannerImage
  bannerClassName?: string
}

interface BannerProps {
  banner: BannerData
  idIndex?: string
}

export default function Banner({
  banner,
  idIndex = '1',
}: BannerProps): React.JSX.Element {
  const {
    title,
    description,
    buttonLabel,
    buttonLink,
    smallImage,
    largeImage,
    bannerClassName,
  } = banner

  const isExternalLink = buttonLink?.startsWith('http')
  const bannerId = `${bannerClassName || 'banner-id'}-${idIndex}`

  return (
    <div
      id={bannerId + '-banner'}
      className={`my-8 block md:grid grid-cols-2 gap-4 rounded-lg bg-indigo-200 ${
        bannerClassName || ''
      }`}
    >
      <div className="p-8 pr-0 col-span-1 flex flex-col justify-between">
        <div>
          <MarketingH5 className="mb-2">{title}</MarketingH5>
          <Body1 className="text-gray-600">{description}</Body1>
        </div>

        {buttonLink && buttonLabel && (
          <Button
            id={bannerId}
            href={buttonLink}
            target={isExternalLink ? '_blank' : '_self'}
            rel={isExternalLink ? 'noopener noreferrer nofollow' : undefined}
            className="mb-8 mt-4 md:mb-0 self-start"
            size="large"
          >
            {buttonLabel}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg col-span-1">
        {smallImage && (
          <Image
            style={{
              maxWidth: smallImage.size?.width,
              maxHeight: smallImage.size?.height,
            }}
            className="w-full object-contain object-center mx-auto lg:hidden"
            src={`https:${smallImage.url}`}
            alt={smallImage.alt || ''}
            width={smallImage.size?.width || 200}
            height={smallImage.size?.height || 200}
          />
        )}
        {largeImage && (
          <Image
            style={{
              maxWidth: largeImage.size?.width,
              maxHeight: largeImage.size?.height,
            }}
            className="w-full object-contain object-center mx-auto hidden lg:block"
            src={`https:${largeImage.url}`}
            alt={largeImage.alt || ''}
            width={largeImage.size?.width || 200}
            height={largeImage.size?.height || 200}
          />
        )}
      </div>
    </div>
  )
}
