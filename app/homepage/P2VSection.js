import Image from 'next/image'
import MaxWidth from '@shared/layouts/MaxWidth'
import voterDataImg from '/public/images/homepage/voter-data.png'
import voterDatabaseImg from '/public/images/homepage/voter-database.png'
import voterOutreachImg from '/public/images/homepage/voter-outreach.png'
import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'

export default function P2VSection() {
  return (
    <div className="bg-cream-500 px-2 py-16">
      <MaxWidth>
        <div className="bg-white rounded-3xl p-8">
          <h2 className="text-center text-3xl font-semibold  md:text-4xl  xl:text-5xl mb-16">
            Here&apos;s your path to victory:
          </h2>
          <div className="grid grid-cols-12 gap-3 relative items-start lg:pb-0 mb-5 p-3">
            <div className="col-span-12 md:col-span-1 lg:col-span-2 justify-self-start md:justify-self-end items-start h-full">
              <div className="flex text-xl mt-2 w-[88px] h-[88px] bg-[#FFC523] items-center justify-center rounded-[20px]">
                <span className="font-sfpro font-medium text-indigo-800 text-center text-[40px]">
                  1
                </span>
              </div>
            </div>
            <div className="col-span-10 md:col-span-5 justify-self-center lg:justify-self-end lg:pr-10 mb-5">
              <div className="md:pl-10">
                <h3 className="text-[32px] mt-2 text-start font-medium leading-10">
                  Know exactly how many votes you need to win.
                </h3>
                <Body1 className="mt-2">
                  Automatically analyze voter data in your district, calculate
                  the number of votes you need, and get a step-by-step plan for
                  executing voter outreach.
                </Body1>
                <div className="mt-4">
                  <Button
                    size="large"
                    className="py-2"
                    href="/sign-up"
                    id="p2v_get_started"
                    color="neutral"
                  >
                    Get started
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 justify-self-center lg:justify-self-start lg:pl-10">
              <div className="w-auto ml-0 flex relative">
                <Image
                  src={voterDataImg}
                  sizes="100vw"
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 relative items-start lg:pb-0 mb-5 p-3">
            <div className="col-span-12 md:col-span-5 justify-self-start lg:justify-self-end lg:pl-10 order-last md:order-first h-full">
              <div className="w-auto ml-0 flex relative items-start">
                <Image
                  src={voterDatabaseImg}
                  sizes="100vw"
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-1 lg:col-span-2 justify-self-start md:justify-self-end items-start h-full w-[100px] md:pl-10">
              <div className="flex text-xl mt-2 w-[88px] h-[88px] bg-[#FF9364] items-center justify-center rounded-[20px]">
                <span className="font-sfpro font-medium text-slate-50 text-center text-[40px]">
                  2
                </span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 justify-self-center md:justify-self-start items-start lg:pr-10 mb-5 w-full">
              <div className="md:pl-[70px]">
                <h3 className="text-[32px] mt-2 text-start font-medium leading-10">
                  Build a targeted list of winnable voters.
                </h3>
                <Body1 className="mt-2">
                  Use voter database filters like age, party affiliations, and
                  voting propensity to reach your people.
                </Body1>
                <div className="mt-4">
                  <Button
                    size="large"
                    href="/sign-up"
                    id="p2v_get_started2"
                    color="neutral"
                  >
                    Get started
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 relative items-start pb-14 lg:pb-0 mb-5 p-3">
            <div className="col-span-12 md:col-span-1 lg:col-span-2 justify-self-start md:justify-self-end items-start h-full">
              <div className="flex text-xl mt-2 w-[88px] h-[88px] bg-[#A4C2F5] items-center justify-center rounded-[20px]">
                <span className="font-sfpro font-medium text-indigo-800 text-center text-[40px]">
                  3
                </span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 justify-self-center lg:justify-self-end lg:pr-10 mb-5">
              <div className="md:pl-10">
                <h3 className="text-[32px] mt-2 text-start font-medium leading-10">
                  Handle the outreach with tech from GoodParty.org.
                </h3>
                <Body1 className="mt-2">
                  Run a top-tier campaign at a fraction of the cost.
                </Body1>
                <div className="mt-4">
                  <Button
                    size="large"
                    href="/sign-up"
                    id="p2v_get_started3"
                    color="neutral"
                  >
                    Get started
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 justify-self-center lg:justify-self-start lg:pl-10">
              <div className="w-auto ml-0 flex relative items-start">
                <Image
                  src={voterOutreachImg}
                  sizes="100vw"
                  className="object-contain"
                  alt=""
                />
              </div>
            </div>{' '}
          </div>
        </div>
      </MaxWidth>
    </div>
  )
}
