import MaxWidth from '@shared/layouts/MaxWidth'
import Body1 from '@shared/typography/Body1'
import Link from 'next/link'
import { MdArrowOutward } from 'react-icons/md'

const ctaCards = [
  {
    title: 'Candidates',
    description: 'Explore candidates running near you',
    link: '/candidates',
    bg: 'bg-orange-100',
  },
  {
    title: 'Upcoming elections',
    description: 'Explore upcoming elections near you',
    link: '/elections',
    bg: 'bg-[#CCEADD]',
  },
]

export default function CtaSection() {
  return (
    <section className="bg-cream-500 text-black pb-12">
      <MaxWidth>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ctaCards.map((card) => (
            <Link
              href={card.link}
              key={card.title}
              className="hover:opacity-80 no-underline transition-opacity duration-300"
            >
              <div
                className={`${card.bg} p-8 lg:p-12 rounded-xl`}
                key={card.title}
              >
                <Body1 className="font-semibold">Candidates</Body1>
                <div className="mt-16 lg:mt-24 flex items-end gap-4 justify-between">
                  <h3 className="text-4xl lg:text-5xl font-semibold">
                    Explore candidates running near you
                  </h3>
                  <MdArrowOutward size={64} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </MaxWidth>
    </section>
  )
}
