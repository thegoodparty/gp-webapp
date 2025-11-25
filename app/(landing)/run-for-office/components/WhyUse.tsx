import Body1 from '@shared/typography/Body1'
import MarketingH3 from '@shared/typography/MarketingH3'
import Overline from '@shared/typography/Overline'

export default function WhyUse(): React.JSX.Element {
  const vanityMetrics = [
    {
      title: 'Simple',
      value: '15 min',
      description:
        'Access easy-to-use content creation tools and custom voter contact data in minutes.',
    },
    {
      title: 'Powerful',
      value: '39%',
      description:
        'Candidates that use our free and affordable tools and data win their elections.',
    },
    {
      title: 'Supportive',
      value: '2,500+',
      description:
        'Active non-partisan and independent candidates on the platform in all 50 states.',
    },
  ]

  return (
    <section className="bg-primary-dark text-white pt-16 px-8 pb-24 text-center">
      <MarketingH3 className="mb-4 !text-4xl md:!text-5xl">
        Why use GoodParty.org?
      </MarketingH3>
      <Body1>
        We&apos;re leveling the playing field for non-partisan, independent, and
        third-party candidates.
      </Body1>
      <div className="flex flex-col md:flex-row px-8 md:px-0 gap-8 mt-12 mx-auto max-w-4xl">
        {vanityMetrics.map((metric) => (
          <div key={metric.title} className="text-left">
            <Overline>{metric.title}</Overline>
            <Body1 className="mt-4 border-l border-white px-4">
              <span className="font-outfit block font-medium text-5xl leading-snug">
                {metric.value}
              </span>
              {metric.description}
            </Body1>
          </div>
        ))}
      </div>
    </section>
  )
}

