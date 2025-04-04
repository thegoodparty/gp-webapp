import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'

const { MdAnalytics, MdPeople, MdAutoAwesome } = require('react-icons/md')

const cards = [
  {
    title: 'Run a data driven campaign',
    description:
      'Get custom data for your race in minutes to level up your outreach efforts and understand what motivates your voters.',
    icon: <MdAnalytics size={32} />,
  },
  {
    title: 'Access to campaign experts',
    description:
      "Get 1:1 support and advice from our campaign experts, whether you're running for town council or Congress.",
    icon: <MdPeople size={32} />,
  },
  {
    title: 'Create winning content',
    description:
      "Save time and multiply your campaign's output with AI trained on dozens of carefully honed templates, from press releases to endorsement pitches.",
    icon: <MdAutoAwesome size={32} />,
  },
]

export default function InfoCardsSection() {
  return (
    <section className="grid grid-cols-12 gap-8 my-16">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={`col-span-12 md:col-span-6 lg:col-span-4 bg-white p-4 rounded-xl border border-black/[0.12] ${
            index > 1 ? 'hidden lg:block' : ''
          }`}
        >
          {card.icon}
          <H2 className="my-2">{card.title}</H2>
          <Body1 className="text-gray-600">{card.description}</Body1>
        </div>
      ))}
    </section>
  )
}
