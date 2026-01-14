import Body2 from '@shared/typography/Body2'
import H2 from '@shared/typography/H2'
import H3 from '@shared/typography/H3'
import { numberFormatter } from 'helpers/numberHelper'
import Image from 'next/image'

const WINNER_COUNT = 3444

interface WinnerCard {
  name: string
  office: string
  location: string
  image: string
}

const cards: WinnerCard[] = [
  {
    name: 'Aaron Bautista',
    office: 'Board of Regents',
    location: 'Nevada',
    image: 'https://assets.goodparty.org/set-password/aaron.jpg',
  },
  {
    name: 'Jennifer Hutchinson',
    office: 'School Board',
    location: 'Rock Hill, SC',
    image: 'https://assets.goodparty.org/set-password/jennifer.jpg',
  },
  {
    name: 'Eve Little',
    office: 'City Council',
    location: 'Newark, CA',
    image: 'https://assets.goodparty.org/set-password/eve.jpg',
  },
  {
    name: 'Lucas Bear',
    office: 'Public Power District Board',
    location: 'Hay Springs, NE',
    image: 'https://assets.goodparty.org/set-password/lucas.jpg',
  },
]

export default function WinnersSection(): React.JSX.Element {
  return (
    <section className="mt-16 pb-16">
      <H2 className="mb-8">
        Join {numberFormatter(WINNER_COUNT)} Independent Winners
      </H2>

      <div className="grid grid-cols-12 gap-8">
        {cards.map((card, index) => (
          <div
            key={card.name}
            className={`col-span-6 md:col-span-4 lg:col-span-3 bg-white  rounded-xl border border-black/[0.12] ${
              index === 3 ? 'hidden lg:block' : ''
            } ${index === 2 ? 'hidden md:block' : ''}`}
          >
            <div className="relative w-full h-64 md:h-72">
              <Image
                src={card.image}
                alt={card.name}
                fill
                className=" object-cover rounded-t-xl"
              />
            </div>
            <div className="p-4 text-center">
              <H3>{card.name}</H3>
              <Body2 className="text-gray-600">{card.office}</Body2>
              <Body2 className="text-gray-600">{card.location}</Body2>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
