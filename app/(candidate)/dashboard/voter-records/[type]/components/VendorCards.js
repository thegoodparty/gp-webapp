import Paper from '@shared/utils/Paper'
import VendorCard from './VendorCard'
import H2 from '@shared/typography/H2'
import Body2 from '@shared/typography/Body2'

function vendorsByType(type) {
  let vendors
  if (type === 'directmail') {
    vendors = [
      {
        logo: '/images/voterfile/mailing-logo.svg',
        name: 'Mailing.com',
        url: 'https://www.mailing.com/',
        subTitle: 'Turnkey Direct Mail Services at Scale',
        description:
          'Seamlessly execute your direct mail marketing campaigns and create exceptional print-based brand experiences.',
      },
      {
        logo: '/images/voterfile/speakeasy-logo.svg',
        name: 'SpeakEasy Political',
        url: 'https://www.speakeasypolitical.com/',
        subTitle: 'High-Impact Direct Mail Campaigns',
        description:
          'Our political direct mail templates are field tested and professionally designed to have a profound impact on voters, and propel your campaign to victory.',
        label: 'Progressive-Leaning',
      },
    ]
  }
  if (type === 'doorknocking') {
    vendors = [
      {
        logo: '/images/voterfile/ecanvasser-logo.svg',
        name: 'Ecanvasser',
        url: 'https://www.ecanvasser.com/',
        subTitle: 'The Smart Digital Canvassing Solution',
        description:
          'Eliminate paperwork and cover more ground. Ecanvasser gives you an effective way to maximize field sales, manage door-to-door canvassing, and track field activity in real time.',
      },
      {
        logo: '/images/voterfile/qomon-logo.svg',
        name: 'Qomon',
        url: 'https://qomon.com/',
        subTitle: 'Mobilize Big For Your Cause',
        description:
          'The most innovative tool to mobilize your supporters, voters, constituents and donors from the bottom up.',
      },
      {
        logo: '/images/voterfile/universe-logo.svg',
        name: 'Universe',
        url: 'https://universe.app/',
        subTitle: 'Expanding Advocacy',
        description:
          "Whether you're running for local office, organizing a community initiative, running a membership organization, or targeting donors, Universe has the outreach tools you need - all linked to a single, easy-to-search supporter database",
        label: 'Progressive-Leaning',
      },
    ]
  }

  if (type === 'digitalads') {
    vendors = [
      {
        logo: '/images/voterfile/choozle-logo.svg',
        name: 'Choozie',
        url: 'https://choozle.com/',
        subTitle: 'Digital Advertising Software Platform',
        description:
          'Quickly manage and optimize multiple advertisers and programmatic ad campaigns, no matter your campaign goals.',
      },
      {
        logo: '/images/voterfile/basis-logo.svg',
        name: 'Basis',
        url: 'https://basis.com/',
        subTitle: 'Digital Advertising Platform',
        description:
          'Basis Platform integrates and automates the digital advertising process. It unites teams, integrates disparate systems and tools, automates workflows, reconciles billing, and streamlines campaigns from end-to-end.',
      },
      {
        logo: '/images/voterfile/stackadapt-logo.svg',
        name: 'StackAdapt',
        url: 'https://www.stackadapt.com/industry-solutions/political',
        subTitle: 'Your Political Advertising Solution',
        description:
          "Speed of campaign planning and execution makes all the difference in a political advertising campaign. With StackAdapt's multi-channel programmatic platform, you can reach voters across all of their channels and devices, capturing their attention when and where they're consuming content.",
      },
    ]
  }
  return vendors
}

export default function VendorCards(props) {
  const { type } = props

  const vendors = vendorsByType(type)

  if (!vendors) {
    return null
  }

  return (
    <Paper className="mt-4">
      <H2>Recommended Partner Tools</H2>
      <Body2 className="text-gray-600 mt-1">
        Use the following tools to execute your campaign tactics
      </Body2>
      <div className="mt-8 grid grid-cols-12 gap-4">
        {vendors.map((card, index) => (
          <div className="col-span-12  h-full md:col-span-6" key={index}>
            <VendorCard {...card} />
          </div>
        ))}
      </div>
    </Paper>
  )
}
