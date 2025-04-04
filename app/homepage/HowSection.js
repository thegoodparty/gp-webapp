import Image from 'next/image'
import MaxWidth from '@shared/layouts/MaxWidth'
import softwareImg from '/public/images/homepage/software.png'
import genzImg from '/public/images/homepage/genz.png'
import mapImg from '/public/images/homepage/map.png'
import Button from '@shared/buttons/Button'

export default function HowSection() {
  return (
    <MaxWidth>
      <div className="absolute -mt-[125px] md:-mt-[175px] lg:-mt-[250px] mr-3">
        <Image
          src="/images/homepage/circles.svg"
          width="123"
          height="264"
          className="ml-12"
          alt="GoodParty.org"
        />
      </div>
      <div className="bg-indigo-50">
        <h3 className="text-[28px] md:text-[56px] font-semibold text-center pb-5 md:pb-20 pt-40 md:pt-20">
          How GoodParty.org works
        </h3>
        <div className="grid grid-cols-12 gap-3 relative items-start lg:pb-0 mb-5 p-3">
          <div className="col-span-12 md:col-span-1 lg:col-span-2 justify-self-start md:justify-self-end items-start h-full">
            <div className="flex text-xl mt-2 w-[88px] h-[88px] bg-secondary-light items-center justify-center rounded-[20px]">
              <span className="font-sfpro font-medium text-indigo-800 text-center text-[40px]">
                1
              </span>
            </div>
          </div>
          <div className="col-span-10 md:col-span-5 justify-self-center lg:justify-self-end lg:pr-10 mb-5">
            <div className="md:pl-10">
              <div className="text-[32px] mt-2 text-start font-medium leading-10">
                Make independent candidates viable
              </div>
              <div className="font-sfpro font-light text-lg leading-6 mt-2">
                Our free AI tools for campaigns, candidate recruitment, and team
                of experts are building up more competitive independent
                candidates across the country
              </div>
              <div className="mt-4">
                <Button
                  size="large"
                  className="!py-2"
                  href="/run-for-office"
                  id="hiw_act_now"
                  color="neutral"
                >
                  Run for office
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 justify-self-center lg:justify-self-start lg:pl-10">
            <div className="w-auto ml-0 flex relative">
              <Image
                src={softwareImg}
                sizes="100vw"
                className="object-contain"
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 relative items-start lg:pb-0 mb-5 p-3">
          <div className="col-span-12 md:col-span-5 justify-self-start lg:justify-self-end lg:pl-10 order-last md:order-first h-full">
            <div className="absolute -ml-10 lg:-ml-40 mt-20 mr-3 z-50">
              <Image
                src="/images/homepage/bolts.svg"
                width="90"
                height="90"
                className="ml-12"
                alt="GoodParty.org"
              />
            </div>
            <div className="w-auto ml-0 flex relative items-start">
              <Image
                src={genzImg}
                sizes="100vw"
                className="object-contain"
                alt=""
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-1 lg:col-span-2 justify-self-start md:justify-self-end items-start h-full w-[100px] md:pl-10">
            <div className="flex text-xl mt-2 w-[88px] h-[88px] bg-purple-400 items-center justify-center rounded-[20px]">
              <span className="font-sfpro font-medium text-slate-50 text-center text-[40px]">
                2
              </span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 justify-self-center md:justify-self-start items-start lg:pr-10 mb-5 w-full">
            <div className="md:pl-[70px]">
              <div className="text-[32px] mt-2 text-start font-medium leading-10">
                Mobilize volunteers to support winning campaigns
              </div>
              <div className="font-sfpro font-light text-lg leading-6 mt-2">
                We make it easy for voters to find exciting candidates both on
                their ballots and across the country! Plug into grassroots
                campaigns with our volunteer programs
              </div>
              <div className="mt-4">
                <Button
                  size="large"
                  className="!py-2"
                  href="/volunteer"
                  id="hiw_volunteer"
                  color="neutral"
                >
                  Volunteer
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 relative items-start pb-14 lg:pb-0 mb-5 p-3">
          <div className="col-span-12 md:col-span-1 lg:col-span-2 justify-self-start md:justify-self-end items-start h-full">
            <div className="flex text-xl mt-2 w-[88px] h-[88px] bg-orange-400 items-center justify-center rounded-[20px]">
              <span className="font-sfpro font-medium text-indigo-800 text-center text-[40px]">
                3
              </span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 justify-self-center lg:justify-self-end lg:pr-10 mb-5">
            <div className="md:pl-10">
              <div className="text-[32px] mt-2 text-start font-medium leading-10">
                Make America a truly representative democracy
              </div>
              <div className="font-sfpro font-light text-lg leading-6 mt-2">
                More viable independent options means less money in politics,
                less corruption, and more time focusing on the issues that
                matter most
              </div>
              <div className="mt-4">
                <Button
                  size="large"
                  className="!py-2"
                  href="/run-for-office"
                  id="hiw_run"
                  color="neutral"
                >
                  Act now
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 justify-self-center lg:justify-self-start lg:pl-10">
            <div className="w-auto ml-0 flex relative items-start">
              <Image
                src={mapImg}
                sizes="100vw"
                className="object-contain"
                alt=""
              />
            </div>
          </div>{' '}
        </div>
      </div>
    </MaxWidth>
  )
}
