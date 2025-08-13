import H3 from '@shared/typography/H3'
import MarketingH2 from '@shared/typography/MarketingH2'
import { FaHandHoldingHeart, FaRegHeart, FaRegStar } from 'react-icons/fa'
import { GrGroup } from 'react-icons/gr'
const pledges = [
  {
    title: 'Independent',
    description:
      'Candidates are running outside the two-party system as an Independent, nonpartisan, or third-party candidate.',
    icon: <FaRegHeart />,
    iconBgColor: '#D1E7FE',
  },
  {
    title: 'People-Powered',
    description:
      'Candidates take the majority of their funds from grassroots donors and reject the influence of special interests and big money.',
    icon: <GrGroup />,
    iconBgColor: '#FFE291',
  },
  {
    title: 'Anti-Corruption',
    description:
      'Candidates pledge to be accountable and transparent with their policy agendas and report attempts to unduly influence them.',
    icon: <FaRegStar />,
    iconBgColor: '#EDDCFF',
  },
  {
    title: 'Civility',
    description:
      "Candidates pledge to run a clean campaign free of mudslinging and uphold a minimum standard of civility in their campaign's conduct.",
    icon: <FaHandHoldingHeart />,
    iconBgColor: '#CCEADD',
  },
]

export default function PledgeSection() {
  return (
    <section className="bg-primary-dark p-7 lg:p-16">
      <div className="max-w-screen-lg mx-auto ">
        <div className="text-center">
          <MarketingH2>The GoodParty.org Pledge</MarketingH2>
          <div className="mt-4 text-lg">
            All candidates empowered by GoodParty.org agree to the following:
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8 lg:gap-8">
          {pledges.map((pledge) => (
            <div key={pledge.title} className="flex mb-12">
              <div
                className="shrink-0 rounded-full h-12 w-12 flex items-center justify-center text-black"
                style={{ backgroundColor: pledge.iconBgColor }}
              >
                {pledge.icon}
              </div>
              <div className="ml-4">
                <H3 className="mb-4">{pledge.title}</H3>
                <div className="text-lg font-normal font-sans leading-relaxed">
                  {pledge.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
