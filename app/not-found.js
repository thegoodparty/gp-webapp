import PrimaryButton from '@shared/buttons/PrimaryButton'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-3 lg:px-5">
      <div className="grid grid-cols-12 gap-4 items-center justify-center">
        <div className="col-span-12 lg:col-span-6 ">
          <div className="relative h-[50vh]">
            <Image
              src="/images/error-pages/error-404.svg"
              data-cy="logo"
              fill
              className="object-contain object-center"
              alt="Error"
              priority
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <H1>Error: 404 Not Found</H1>
          <Body1 className="my-7">
            Whoops! It appears our internet gnomes took a nap.
            <br />
            <br />
            It seems the page has decided to join one of the two major parties,
            and therefore no longer meets the standards of GoodParty.org.
          </Body1>
          <Link href="/">
            <PrimaryButton>Back to our homepage</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
