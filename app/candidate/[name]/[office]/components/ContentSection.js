'use client'
import { combineIssues } from 'app/(candidate)/dashboard/website/util/website.util'
import Card from './Card'
import { usePublicCandidate } from './PublicCandidateProvider'

export default function ContentSection() {
  const [candidate] = usePublicCandidate()
  const { Stances, party, claimed } = candidate
  const { details, campaignPositions } = claimed || {}
  const {
    occupation,
    funFact,
    party: claimedParty,
    pastExperience,
    runningAgainst,
    customIssues,
  } = details || {}

  const emptyItem = {
    title: 'Information not available',
    description: 'Candidate has not filled out this section yet.',
  }

  const runningAgainstItems =
    runningAgainst &&
    runningAgainst.map((item) => {
      return {
        title: `${item.name} (${item.party})`,
        description: item.description,
      }
    })

  const campaignIssues = combineIssues(campaignPositions, customIssues)
  const brStances = Stances || []

  brStances.forEach((stance, index) => {
    campaignIssues.push({
      title: stance.Issue?.name || `Stance ${index + 1}`,
      description: stance.stanceStatement,
    })
  })
  const cards = [
    {
      title: 'About Me',
      items: [
        { title: 'Party', description: claimedParty || party },
        { title: 'Occupation', description: occupation },
        funFact && { title: 'Fun Fact', description: funFact },
        pastExperience && {
          title: 'Past Experience',
          description: pastExperience,
        },
      ].filter(Boolean),
    },

    {
      title: 'My Top Issues',
      items:
        campaignIssues && campaignIssues.length > 0
          ? campaignIssues
          : [emptyItem],
    },
    {
      title: "Who I'm Running Against",
      items:
        runningAgainstItems && runningAgainstItems.length > 0
          ? runningAgainstItems
          : [emptyItem],
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
