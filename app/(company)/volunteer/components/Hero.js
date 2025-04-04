import MaxWidth from '@shared/layouts/MaxWidth'
import MarketingH1 from '@shared/typography/MarketingH1'
import Image from 'next/image'
import HeroForm from './HeroForm'
import heroImg from 'public/images/landing-pages/volunteer-hero.png'

export default function Hero() {
  return (
    <>
      <MaxWidth>
        <div className="grid grid-cols-12 gap-4 md:gap-10">
          <div className=" col-span-12 md:col-span-6">
            <MarketingH1 className="md:text-8xl">
              Get involved with{' '}
              <Image
                src="/images/logo/heart.svg"
                alt="GoodParty"
                width={64}
                height={64}
                priority
                className="inline-block"
              />{' '}
              civics
            </MarketingH1>
            <HeroForm />
          </div>
          <div className=" col-span-12 md:col-span-6">
            <Image src={heroImg} alt="volunteer" width={629} height={880} />
          </div>
        </div>
      </MaxWidth>
      <div className="bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#E0E6EC_55%)] h-[calc(100vw*0.09)] w-full md:-mt-40" />
      <div className="h-20 md:h-40 bg-indigo-200"></div>
    </>
  )
}
