import MarketingH4 from '@shared/typography/MarketingH4'
import Overline from '@shared/typography/Overline'
import DescriptionLabel from './DescriptionLabel'

export default function TopIssuesCard({candidate, maxToShow = 3}) {
  const stances = candidate?.Stances ?? []
  if (stances.length === 0) {
    return null
  }

  return (
    <section className="bg-primary-dark border border-gray-700 p-6 rounded-2xl mt-4">
      <Overline className="text-gray-400 mb-2">Voter Issues</Overline>
      <MarketingH4 className="mb-8">Top Issues</MarketingH4>

      {stances.slice(0, maxToShow).map((stance, idx) => (
        <DescriptionLabel
          key={stance.id}
          title={`Issue ${idx + 1} - ${stance.Issue?.name ?? ''}`}
          description={stance.stanceStatement}
        />
      ))}
    </section>
  )
}
