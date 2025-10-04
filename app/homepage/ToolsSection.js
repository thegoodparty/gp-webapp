import Image from 'next/image'
import Carousel from '@shared/inputs/Carousel'
import MaxWidth from '@shared/layouts/MaxWidth'
import dialogImg from 'public/images/homepage/dialog.png'
import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'

const sections = [
  {
    name: 'Adam Khosroabadi - Independent',
    title: 'Milwaukie, OR City Council',
    description:
      "With the AI tools on the platform, the voter list, and the data, being able to go Pro for 10 bucks was just a no-brainer. Without you guys texting, I don't know if I would have won this race.",
    img: '/images/homepage/adam.jpg',
  },

  {
    name: 'Joseph Faulkner - Independent',
    title: 'Fayetteville, TN Alderman',
    description:
      "I've been putting in work for probably two years now, but you also have to have data. The help from GoodParty.org put me over the edge.",
    img: '/images/homepage/joseph.jpg',
  },
  {
    title: 'Justice of the Peace, North Las Vegas, NV',
    name: 'Jonathan Cooper - Independent',
    description:
      "You guys absolutely were a game changer to me. I would not have even known what a voter data file was if I had not gotten connected with GoodParty.org very early on. I'm just overjoyed and happy that you guys were in my corner.",
    img: '/images/homepage/jonathan.jpg',
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
                  Talk to an expert
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
                alt="What would you like to do?"
              />
            </div>
          </div>
          <div className="col-span-12 mt-20 justify-self-center">
            <Carousel sections={sections} />
          </div>
        </div>
      </MaxWidth>
    </section>
  )
}
