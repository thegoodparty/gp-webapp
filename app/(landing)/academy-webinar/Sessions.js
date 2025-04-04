import MaxWidth from '@shared/layouts/MaxWidth'
import Body1 from '@shared/typography/Body1'
import MarketingH2 from '@shared/typography/MarketingH2'

const weeks = [
  {
    name: 'Week 1',
    title: 'Finding your “why”',
    desc: 'The most important aspect of a political campaign is the reason why you\'re running. We\'ll help you find your "why" and how to message it to your supporters.',
  },
  {
    name: 'Week 2',
    title: 'Crafting your campaign plan',
    desc: "Planning a campaign means building a team, building your platform, raising money, and prioritizing your time effectively. We'll cover this and help you create a personalized plan.",
  },
  {
    name: 'Week 3',
    title: 'Running, winning, and serving',
    desc: "Campaigns are both art and science. We'll help you devise the tactics and messaging you'll use to reach voters and offer advice about how to be a strong representative for your community.",
  },
]

export default function Sessions() {
  return (
    <MaxWidth>
      <div className="lg:w-2/3 mt-24 mb-16">
        <MarketingH2>
          Three sessions to empower your political journey
        </MarketingH2>
        <h3 className="text-lg mt-7">
          Here&apos;s what you can expect in our course designed to help you
          explore, prepare, and ultimately run for office.
        </h3>
      </div>
      <div className="grid grid-cols-12 gap-8">
        {weeks.map((week) => (
          <div key={week.name} className="col-span-12 md:col-span-4">
            <div className="text-3xl py-5 px-7 border-2 border-primary rounded-2xl inline-block bg-slate-100 shadow-md">
              {week.name}
            </div>
            <h4 className="text-3xl my-5">{week.title}</h4>
            <Body1>{week.desc}</Body1>
          </div>
        ))}
      </div>
    </MaxWidth>
  )
}
