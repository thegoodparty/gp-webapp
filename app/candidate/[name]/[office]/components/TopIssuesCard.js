import MarketingH4 from '@shared/typography/MarketingH4'
import Overline from '@shared/typography/Overline'
import DescriptionLabel from './DescriptionLabel'

export default function TopIssuesCard(props) {
  const { candidate } = props
  const { topIssues } = candidate
  if (!topIssues || topIssues.length === 0) {
    return null
  }

  return (
    <section className="bg-primary-dark border border-gray-700 p-6 rounded-2xl mt-4">
      <Overline className="text-gray-400 mb-2">Voter Issues</Overline>
      <MarketingH4 className="mb-8">Top Issues</MarketingH4>

      {topIssues.map((item, index) => (
        <DescriptionLabel
          key={index}
          title={`Issue ${index + 1} - ${item.issue}`}
          description={item.stance}
        />
      ))}
    </section>
  )
}
