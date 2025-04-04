import Image from 'next/image'
import Carousel from '@shared/inputs/Carousel'
import MaxWidth from '@shared/layouts/MaxWidth'
import dialogImg from '/public/images/homepage/dialog.png'
import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'

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
        <div className="grid grid-cols-12 gap-3 relative pb-14 lg:pb-0 items-stretch text-white">
          <div className="col-span-12 lg:col-span-6 justify-self-center lg:justify-self-end lg:pr-10">
            <h2 className=" text-3xl font-semibold  md:text-4xl  xl:text-5xl mb-8">
              Transform civic leadership with more tools from GoodParty.org.
            </h2>

            <Body1>
              Independent candidates can access high quality campaign materials,
              interactive training sessions, and our team of advisors to
              navigate campaign strategy and outreach.
            </Body1>
            <div className="flex flex-col md:flex-row">
              <div className="mt-4">
                <Button
                  size="large"
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
                  href="/get-a-demo"
                  id="candidates_academy"
                  color="neutral"
                >
                  Learn how to run
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 justify-self-center lg:justify-self-start lg:pl-10">
            <div className="ml-0 flex relative h-auto w-full">
              <Image
                src={dialogImg}
                sizes="100vw"
                className="object-contain object-top"
                alt=""
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
