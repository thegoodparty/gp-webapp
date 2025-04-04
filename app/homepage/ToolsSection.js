import Image from 'next/image'
import Carousel from '@shared/inputs/Carousel'
import MaxWidth from '@shared/layouts/MaxWidth'
import softwareImg from '/public/images/homepage/software.png'
import Button from '@shared/buttons/Button'

const sections = [
  {
    name: 'Peter H. - Independent',
    title: 'Social Impact Consultant',
    subtitle: 'GoodParty.org Academy Graduate',
    description:
      "My takeaway was “I could probably shake that many hands!” it's within reach, I could represent my community, my neighborhood. It's not a moonshot.",
    img: '/images/homepage/peter.jpg',
  },
  {
    name: 'Chaz M. - Independent',
    title: 'Firefighter',
    subtitle: 'GoodParty.org Academy Graduate',
    description:
      "With where GoodParty.org's AI is today, you could [run for office] today… my aha moment was how powerful the software is. And it's free!",
    img: '/images/homepage/chaz.jpg',
  },
  {
    title: 'Former candidate for Maine House ',
    name: 'Anne G. - Independent',
    subtitle: 'GoodParty.org Certified',
    description:
      'As an Indie candidate without a party organization it meant a lot to me to have someone working hard to help me reach younger voters.',
    img: '/images/homepage/anne.jpg',
  },
]

export default function ToolsSection() {
  return (
    <section className="bg-primary-dark pb-20">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3 relative pb-14 lg:pb-0 -pt-[50px] items-stretch">
          <div className="col-span-12 lg:col-span-6 justify-self-center lg:justify-self-end lg:pr-10 mt-10 p-10 lg:-mt-[75px]">
            <div className="w-auto ml-0 flex relative md:-mt-20">
              <Image
                src="/images/homepage/dots.svg"
                sizes="100vw"
                height={151}
                width={151}
                className="object-contain"
                alt="dots"
              />
            </div>

            <div className="font-sfpro text-slate-50 font-semibold text-[36px] md:text-[54px] leading-[36px] md:leading-[64px]  mt-2">
              Free tools + experts power winning campaigns
            </div>

            <div className="font-sfpro text-slate-50 text-[18px] leading-6 mt-2">
              Independent candidates get free access to our team with 50+ years
              of campaign experience and our latest AI tools that keep your
              campaign on track
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="mt-4">
                <Button
                  size="large"
                  className="!py-2"
                  href="/run-for-office"
                  id="candidates_tool"
                  color="secondary"
                >
                  Free campaign tools
                </Button>
              </div>
              <div className="mt-4 pl-0 md:pl-3">
                <Button
                  size="large"
                  className="!py-2"
                  href="/get-a-demo"
                  id="candidates_academy"
                  color="neutral"
                >
                  Get a Demo
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 justify-self-center lg:justify-self-start lg:pl-10 mt-8 md:mt-40 lg:mt-0">
            <div className="ml-0 flex relative z-50 mt-10 md:-mt-40 lg:-mt-[125px] h-auto w-full">
              <Image
                src={softwareImg}
                sizes="100vw"
                className="object-contain"
                alt=""
              />
            </div>
            <div className="flex justify-end right-0 pr-5 z-50">
              <Image
                src="/images/homepage/track.svg"
                width="90"
                height="90"
                className="ml-12"
                alt="track"
              />
            </div>
          </div>
          <div className="col-span-12 mt-20 justify-self-center">
            <Carousel sections={sections} />

            <div className="flex justify-end mt-20 mr-3 z-50">
              <Image
                src="/images/homepage/hex.svg"
                width="90"
                height="90"
                className="ml-12"
                alt="GoodParty.org"
              />
            </div>
          </div>
        </div>
      </MaxWidth>
    </section>
  )
}
