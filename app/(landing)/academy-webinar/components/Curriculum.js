import MaxWidth from '@shared/layouts/MaxWidth'
import Body1 from '@shared/typography/Body1'
import MarketingH2 from '@shared/typography/MarketingH2'
import Image from 'next/image'

const weeks = [
  {
    name: '1',
    title: 'Finding your “why”',
    desc: 'The most important aspect of a political campaign is the reason why you\'re running. We\'ll help you find your "why" and how to message it to your supporters.',
  },
  {
    name: '2',
    title: 'Crafting your campaign plan',
    desc: "Planning a campaign means building a team, building your platform, raising money, and prioritizing your time effectively. We'll cover this and help you create a personalized plan.",
  },
  {
    name: '3',
    title: 'Running, winning, and serving',
    desc: "Campaigns are both art and science. We'll help you devise the tactics and messaging you'll use to reach voters and offer advice about how to be a strong representative for your community.",
  },
]

export default function Curriculum() {
  return (
    <MaxWidth>
      <div className="lg:w-1/2 mt-24 mb-16">
        <MarketingH2>Our curriculum</MarketingH2>
        <h3 className="text-xl mt-7">
          Here&apos;s what you can expect in our course designed to help you
          explore, prepare, and ultimately run for office.
        </h3>
      </div>
      <div className="grid grid-cols-12 gap-8">
        {weeks.map((week) => (
          <div key={week.name} className="col-span-12 md:col-span-4">
            <div className="relative w-20 h-20">
              <Image
                src="images/landing-pages/yellow-star.svg"
                alt="star"
                height={80}
                width={80}
              />
              <div className="absolute top-0 left-0 font-medium w-20 h-20 flex justify-center items-center text-2xl">
                {week.name}
              </div>
            </div>
            <h4 className="text-3xl my-5">{week.title}</h4>
            <Body1>{week.desc}</Body1>
          </div>
        ))}
      </div>
    </MaxWidth>
  )
}
