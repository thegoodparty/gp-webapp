import MaxWidth from '@shared/layouts/MaxWidth'
import H6 from '@shared/typography/H6'
import { MdEmojiEvents, MdFolderShared, MdGroups } from 'react-icons/md'

interface Item {
  icon: React.JSX.Element
  title: string
}

const items: Item[] = [
  {
    icon: <MdFolderShared />,
    title: 'Level the playing field with voter data and analytics.',
  },
  {
    icon: <MdEmojiEvents />,
    title: 'Get a custom strategy and plan to win your campaign.',
  },
  {
    icon: <MdGroups />,
    title: 'Access powerful campaign outreach tools to win voters.',
  },
]

export default function FactsSection(): React.JSX.Element {
  return (
    <section className="bg-blue-50 h-auto py-16">
      <MaxWidth>
        <h2 className="text-center text-3xl font-semibold  md:text-4xl  xl:text-5xl mb-16">
          GoodParty.org has already empowered 3,400+ Independents to run and
          win... without deep pockets.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className={`pr-8 ${
                index !== 2
                  ? 'border-b md:border-b-0 pb-8 md:pb-0 md:border-r border-black/60'
                  : ''
              }`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <H6>{item.title}</H6>
            </div>
          ))}
        </div>
      </MaxWidth>
    </section>
  )
}
