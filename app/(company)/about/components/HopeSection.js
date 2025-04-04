import { MdArrowForward } from 'react-icons/md'
import { HopeHeader } from './HopeHeader'
import { HopeStat } from './HopeStat'
import { HopeChange } from './HopeChange'
import MaxWidth from '@shared/layouts/MaxWidth'

const HOPE_STATS = [
  {
    percentage: 49,
    blurb: (
      <>
        of Americans with
        <br />
        neither party
      </>
    ),
  },
  { percentage: 96, blurb: <>of elections are at the local level</> },
  {
    percentage: 70,
    blurb: (
      <>
        of local elections are
        <br />
        uncontested
      </>
    ),
  },
]

const HOPE_CHANGES = [
  {
    image: {
      src: '/images/landing-pages/viable-candidate.png',
      alt: 'Viable Candidate',
    },
    header: 'Viable candidates',
    blurb:
      'GoodParty.org recruits, trains, and equips candidates with free and low-cost tools that currently only independently wealthy or partisan candidates have access to. This empowers real people to run efficient, effective, and, above all, viable campaigns.',
    href: '/run-for-office',
    buttonText: 'For candidates',
  },
  {
    image: {
      src: '/images/landing-pages/winning-campaigns.png',
      alt: 'Winning Campaigns',
    },
    header: 'Winning campaigns',
    blurb:
      'We organize volunteer support for candidates in our volunteer community. By joining passionate and driven volunteers with promising candidates nationwide, we set the foundation for victory.',
    href: '/volunteer',
    buttonText: 'For volunteers',
  },
  {
    image: {
      src: '/images/landing-pages/local-results.png',
      alt: 'Local Results',
    },
    header: 'Local results',
    blurb:
      'By building up independent, people-powered, and anti-corruptions around the country, we’re building the bench of quality candidates ready to serve the people in higher office.',
    href: '/elections',
    buttonText: 'For voters',
  },
]

const HopeSection = () => (
  <section
    className="relative
  bg-mint-200
  px-4
  py-8
  md:px-24
  md:py-24
  xl:px-0
  xl:mx-auto"
  >
    <MaxWidth>
      <HopeHeader className="mb-4">
        Hope with a<br className="md:hidden" /> credible plan
      </HopeHeader>
      <p className="text-gray-600 text-xl leading-snug mb-8">
        Why we’re focusing on building the independent movement with local
        elections in 2024
      </p>
      <div className="md:grid md:grid-cols-3 md:gap-x-4 md:gap-y-16">
        {HOPE_STATS.map((stat, key) => (
          <HopeStat {...stat} key={key} />
        ))}
      </div>
      <HopeHeader className="mt-8 mb-8 max-w-[238px] md:max-w-full">
        How we create change
        <MdArrowForward className="inline-block ml-2" />
      </HopeHeader>
      <div
        className="
    md:grid
    md:grid-cols-2
    md:gap-x-4
    md:gap-y-16
    xl:grid-cols-3"
      >
        {HOPE_CHANGES.map((change, key) => (
          <HopeChange key={key} {...change} />
        ))}
      </div>
    </MaxWidth>
  </section>
)

export default HopeSection
