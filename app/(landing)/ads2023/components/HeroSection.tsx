import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import img from 'public/images/landing-pages/ads-hero.jpg'
import HeroForm from './HeroForm'

export default function HeroSection(): React.JSX.Element {
  return (
    <section className="relative">
      {/* <div className="absolute">
        <Image
          alt="Ads 2023"
          src={img}
          className="w-screen object-cover h-[40vh]  md:h-full"
          priority
        />
        <div className="absolute  pb-12 top-0 left-0 w-full min-h-full bg-gradient-to-r from-[#DA48FF] to-[rgba(255,153,0,0.80)] bg-opacity-95"></div>
      </div> */}
      <Image
        alt="Ads 2023"
        src={img}
        className="w-screen object-cover h-[40vh]  md:h-full"
        priority
        fill
      />
      <div className="relative z-10">
        <MaxWidth>
          <div className="grid grid-cols-12 gap-8 pt-12 md:pt-28">
            <div className="col-span-12 md:col-span-6">
              <h1 className="font-semibold font-outfit text-7xl md:text-8xl">
                Take Action
              </h1>
              <h2 className="mt-4 font-medium text-3xl">
                Change our politics for good by joining the movement to end the
                two-party system with people-powered campaigns.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6">
              <HeroForm />
            </div>
          </div>
        </MaxWidth>
        <div className="bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#0D1528_55%)] h-[calc(100vw*0.09)] w-full" />
      </div>
    </section>
  )
}
