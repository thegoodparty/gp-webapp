import Image from 'next/image'
import bgImg from '/public/images/homepage/home-hero.png'
import MaxWidth from '@shared/layouts/MaxWidth'
import Button from '@shared/buttons/Button'
import Link from 'next/link'
import { WINNER_COUNT } from 'app/candidates/page'
import Body1 from '@shared/typography/Body1'

export default async function Hero() {
  const count = WINNER_COUNT

  return (
    <div className="bg-[linear-gradient(129deg,rgba(26,255,255,0.3)_-76.28%,rgba(252,248,243,0.15)_88.96%)]">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-4 lg:gap-8 md:justify-items-center pt-20 items-stretch sm:p-8 md:px-10 lg:p-16 xl:px-0 ">
          <div className="col-span-12 lg:col-span-6">
            <h1 className="text-4xl leading-tight font-semibold  md:text-5xl  xl:text-6xl">
              We{' '}
              <Image
                src="/images/homepage/text-empower.svg"
                width="130"
                height="35"
                alt="empower"
                className="inline-block md:w-[200px] xl:w-[250px]"
              />{' '}
              <Image
                src="/images/homepage/text-independents.svg"
                width="195"
                height="35"
                alt="independents"
                className="inline-block md:w-[300px] xl:w-[375px]"
              />{' '}
              to run, win and serve!
            </h1>
            <Body1 className="mt-8">
              See how our campaign platforms empowers you with:
              <ul className="list-disc list-inside">
                <li>Personalized Voter Data</li>
                <li>Voter Outreach Tools</li>
                <li>Customized content and marketing services</li>
              </ul>
            </Body1>
            <Button
              href="/sign-up"
              size="large"
              className="mt-8 w-full md:w-auto"
            >
              Learn how
            </Button>
          </div>
          <div className="col-span-12 lg:col-span-6 relative h-full">
            <Image
              src={bgImg}
              sizes="50vw"
              className="object-contain object-right-top"
              alt="Win and serve"
              priority
            />
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}
