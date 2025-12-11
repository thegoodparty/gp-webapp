import { BsArrowUpRightCircleFill } from 'react-icons/bs'
import Link from 'next/link'
import { slugify } from 'helpers/articleHelper'
import MarketingH3 from '@shared/typography/MarketingH3'
import MarketingH5 from '@shared/typography/MarketingH5'
import Body1 from '@shared/typography/Body1'
import { MdFolderShared, MdPhonelinkRing, MdGroup } from 'react-icons/md'
import Body2 from '@shared/typography/Body2'

interface Card {
  icon: React.JSX.Element
  title: string
  content: string
}

const cards: Card[] = [
  {
    icon: <MdFolderShared size={48} />,
    title: 'Voter data',
    content:
      'Get access to the intel you need about your constituents at a fraction of the cost.',
  },
  {
    icon: <MdPhonelinkRing size={48} />,
    title: 'Texting tools',
    content:
      'Run SMS text banking programs at our wholesale cost with our network of volunteers.',
  },
  {
    icon: <MdGroup size={48} />,
    title: 'Expert support',
    content:
      'Dedicated support from our team of experts as thought partners on your campaign.',
  },
]

export default function ProTools(): React.JSX.Element {
  return (
    <section className="mb-28">
      <hgroup className="text-white text-center mb-16">
        <MarketingH3 className="mb-4 !text-4xl md:!text-5xl">
          Pro tools
        </MarketingH3>
        <Body1>In addition to our free tools, for just $10/month...</Body1>
      </hgroup>

      <div className="flex-col md:flex-row flex gap-[30px]">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-5 rounded-3xl bg-gradient-to-b from-[#FFF] to-[#F5FBCD]"
          >
            <div className="bg-lime-400 inline-flex rounded-md w-20 h-20 justify-center items-center">
              {card.icon}
            </div>
            <MarketingH5 className="my-[20px]">{card.title}</MarketingH5>
            <Body2 className="mb-14">{card.content}</Body2>
            <Link
              href="/sign-up"
              id={`started-card-${slugify(card.title, true)}`}
              className="flex items-center"
            >
              <BsArrowUpRightCircleFill size={30} />
              <div className="ml-2">Get Started</div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
