import BlackButton from '@shared/buttons/BlackButton';
import Image from 'next/image';
import Link from 'next/link';

export default function Banner({ banner }) {
  const {
    title,
    description,
    buttonLabel,
    buttonLink,
    smallImage,
    largeImage,
  } = banner;

  let isExternalLink = buttonLink?.startsWith('http');
  return (
    <div
      className="pt-10 my-12 flex flex-col items-center rounded-lg overflow-hidden"
      style={{ boxShadow: '0 0 6px 3px rgba(0, 0, 0, 0.1)' }}
    >
      <Image
        src="/images/black-logo.svg"
        width={131}
        height={15}
        alt="GOOD PARTY"
      />
      <div className="grid grid-cols-12 gap3 lg:items-end">
        <div className="col-span-12 lg:col-span-6">
          <div className="px-10 flex flex-col items-center lg:mb-10">
            <h3 className="font-black text-center text-4xl mt-8">{title}</h3>
            <div className="mt-4  text-center">{description}</div>
            {buttonLink && buttonLabel && (
              <div className="mt-6 inline-block">
                {isExternalLink ? (
                  <a
                    href={buttonLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    <BlackButton>
                      <strong>{buttonLabel}</strong>
                    </BlackButton>
                  </a>
                ) : (
                  <Link href={buttonLink}>
                    <BlackButton>
                      <strong>{buttonLabel}</strong>
                    </BlackButton>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="h-60 relative w-full lg:hidden">
            <Image
              src={`https:${smallImage.url}`}
              alt={smallImage.alt}
              sizes="100vw"
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="h-60 relative w-full hidden lg:block">
            <Image
              src={`https:${largeImage.url}`}
              alt={largeImage.alt}
              sizes="100vw"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
