import Body1 from '@shared/typography/Body1'
import MarketingH4 from '@shared/typography/MarketingH4'
import Overline from '@shared/typography/Overline'

export default function AboutCard(props) {
  const { candidate } = props
  const { firstName, lastName, about } = candidate

  return (
    <section className="bg-primary-dark border border-gray-700 p-6 rounded-2xl h-full">
      <Overline className="text-gray-400 mb-2">ABOUT</Overline>
      <MarketingH4>
        {firstName} {lastName}
      </MarketingH4>
      {about && (
        <Body1 className="mt-3 mb-8">
          <div dangerouslySetInnerHTML={{ __html: about }} />
        </Body1>
      )}
    </section>
  )
}
