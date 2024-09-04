import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import MarketingH5 from '@shared/typography/MarketingH5';
import Image from 'next/image';
import Link from 'next/link';

export default function Banner({ banner, idIndex = '1' }) {
  const {
    title,
    description,
    buttonLabel,
    buttonLink,
    smallImage,
    largeImage,
    bannerClassName,
  } = banner;

  const isExternalLink = buttonLink?.startsWith('http');

  return (
    <div
      id={`${bannerClassName || 'banner-id'}-${idIndex}`}
      className={`p-8 my-8 block md:flex rounded-lg bg-indigo-200 ${bannerClassName}`}
    >
      <div className="grow flex flex-col justify-between">
        <div>
          <MarketingH5 className="mb-2">{title}</MarketingH5>
          <Body1 className="text-gray-600">{description}</Body1>
        </div>

        {buttonLink && buttonLabel && (
          <Link
            id="glossary-learn-more"
            href={buttonLink}
            target={isExternalLink ? '_blank' : '_self'}
          >
            <PrimaryButton className="mb-8 mt-4 md:mb-0">
              {buttonLabel}
            </PrimaryButton>
          </Link>
        )}
      </div>

      <div className="relative basis-[200px] min-h-[200px] ml-4">
        {smallImage && (
          <Image
            className="object-contain object-center lg:hidden"
            src={`https:${smallImage.url}`}
            alt={smallImage.alt}
            fill
          />
        )}
        {largeImage && (
          <Image
            className="object-contain object-center hidden lg:block"
            src={`https:${largeImage.url}`}
            alt={largeImage.alt}
            fill
          />
        )}
      </div>
    </div>
  );
}
