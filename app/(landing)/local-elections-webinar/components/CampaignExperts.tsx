import { ExpertCard } from './ExpertCard'

interface ExpertImage {
  src: string
  alt: string
}

interface Expert {
  name: string
  role: string
  desc: string
  img: ExpertImage
}

const EXPERTS: Expert[] = [
  {
    name: 'Jared Alper',
    role: 'GoodParty.org: Politics',
    desc: 'Jared is a political strategist who has managed or served in senior strategic roles on over a dozen campaigns for US Senate, US House, state legislative and local offices across the United States.',
    img: {
      src: '/images/landing-pages/academy-jared.png',
      alt: 'Jared Alper',
    },
  },
  {
    name: 'Rob Booth',
    role: 'GoodParty.org: Mobilization',
    desc: "Rob has nearly 20 years of experience running and winning over 150 electoral, legislative, and ballot campaigns. He has organized everything from local races to presidential campaigns, helped pioneer deep-canvassing during the marriage equality movement, and helped build RepresentUs' volunteer network from the ground up. Rob also led several successful ballot measure efforts as the National Field Director at RepresentUs.",
    img: {
      src: '/images/landing-pages/academy-rob.png',
      alt: 'Rob Booth',
    },
  },
  {
    name: 'Rich Horner',
    role: 'FWD: Political Strategist',
    desc: 'Rich Horner, political strategist and educator, taught at USCB, Canisius, Buffalo State, UB (2017-2023), covering Congress, parties, campaigns, behavior. President of Nexus Point Strategies since 2017, former Political Director for NY State Democratic Committee (2011-2016).',
    img: {
      src: '/images/landing-pages/academy-rich.png',
      alt: 'Rich Horner',
    },
  },
]

const CampaignExperts = (): React.JSX.Element => (
  <div className="bg-primary-dark text-white text-center py-8 px-20 align-center">
    <h3 className="text-3xl font-semibold mb-12 md:text-6xl">
      Our campaigning <br className="md:hidden" />
      experts
    </h3>
    <div className="grid grid-cols-3 gap-12 md:gap-16">
      {EXPERTS.map((expert, key) => (
        <div key={key} className="col-span-3 md:col-span-1">
          <ExpertCard {...expert} />
        </div>
      ))}
    </div>
  </div>
)

export default CampaignExperts
