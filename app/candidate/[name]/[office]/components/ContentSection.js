'use client'
import Card from './Card'
import { usePublicCandidate } from './PublicCandidateProvider'

export default function ContentSection() {
  const [candidate] = usePublicCandidate()
  const { Stances, party, claimed } = candidate
  const { occupation } = claimed || {}

  const topIssues = (Stances || []).map((stance, index) => {
    return {
      title: stance.Issue?.name || `Stance ${index + 1}`,
      description: stance.stanceStatement,
    }
  })

  const emptyItem = {
    title: 'Information not available',
    description: undefined,
  }

  const cards = [
    {
      title: 'About Me',
      items: [
        { title: 'Party', description: party },
        { title: 'Occupation', description: occupation },
      ],
    },
    {
      title: "Why I'm Running",
      items: [emptyItem],
    },
    {
      title: 'My Top Issues',
      items: topIssues.length > 0 ? topIssues : [emptyItem],
    },
    {
      title: "Who I'm Running Against",
      items: [emptyItem],
    },
  ]
  return (
    <div className="text-black flex-1 pt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${index === cards.length - 1 ? 'mb-0' : 'mb-8'}`}
        >
          <Card {...card} />
        </div>
      ))}
    </div>
  )
}
