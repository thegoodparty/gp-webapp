import MaxWidth from '@shared/layouts/MaxWidth'
import Image from 'next/image'
import img from 'public/images/landing-pages/community.png'

import Body1 from '@shared/typography/Body1'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import WarningButton from '@shared/buttons/WarningButton'
import Link from 'next/link'

export default function CommunitySection() {
  return (
    <section className="bg-primary-dark pt-12 text-white">
      <MaxWidth>
        <h2 className="text-center font-semibold text-6xl">
          Ready to serve your community?
        </h2>
        <div className="grid grid-cols-12 gap-4 lg:gap-12 items-center mt-20">
          <div className="col-span-12 md:col-span-6">
            <h3 className="font-semibold  text-2xl mb-4">
              We make running as an independent possible.
            </h3>
            <Body1>
              We help independent candidates run winning campaigns with AI
              tools, a free course for first-timers, and volunteer support. Get
              in touch to learn more!
            </Body1>
            <div className="grid grid-cols-12 mt-8 gap-4">
              <div className="col-span-12 md:col-span-6">
                <Link href="/run-for-office" id="ads23-try-tools">
                  <WarningButton fullWidth>Try our tools</WarningButton>
                </Link>
              </div>
              <div className="col-span-12 md:col-span-6">
                <Link href="/academy" id="ads23-free-course">
                  <SecondaryButton fullWidth>Free course</SecondaryButton>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Image
              alt="We need change"
              src={img}
              className="w-full object-contain"
            />
          </div>
        </div>
      </MaxWidth>
      <div className="bg-[linear-gradient(176deg,_rgba(0,0,0,0)_54.5%,_#0D1528_55%)] h-[calc(100vw*0.09)] w-full" />
    </section>
  )
}
