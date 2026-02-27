'use client'
import { combineIssues } from 'app/(candidate)/dashboard/website/util/website.util'
import Card from './Card'
import { usePublicCandidate } from './PublicCandidateProvider'
import { CandidateStance } from 'helpers/types'

interface RunningAgainst {
  name: string
  party: string
  description: string
}

export default function ContentSection(): React.JSX.Element {
  const [candidate] = usePublicCandidate()
  const Stances = candidate?.Stances
  const party = candidate?.party
  const claimed = candidate?.claimed
  const claimedObj =
    typeof claimed === 'object' && claimed !== null ? claimed : undefined
  const { details, campaignPositions } = claimedObj || {}
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

  const runningAgainstArr: RunningAgainst[] = Array.isArray(runningAgainst)
    ? runningAgainst
    : []
  const runningAgainstItems = runningAgainstArr.map((item: RunningAgainst) => {
    return {
      title: `${item.name} (${item.party})`,
      description: item.description,
    }
  })

  const campaignIssues = combineIssues(campaignPositions, customIssues)
  const brStances = Stances || []

  brStances.forEach((stance: CandidateStance, index: number) => {
    campaignIssues.push({
      title: stance.Issue?.name || `Stance ${index + 1}`,
      description: stance.stanceStatement || '',
    })
  })
  const toDescriptionString = (
    value: string | object | null | undefined,
  ): string | undefined => {
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value !== null)
      return JSON.stringify(value)
    return undefined
  }

  interface CardItem {
    title: string
    description?: string
  }

  const aboutMeItems: CardItem[] = [
    { title: 'Party', description: toDescriptionString(claimedParty || party) },
    { title: 'Occupation', description: toDescriptionString(occupation) },
  ]
  if (funFact) {
    aboutMeItems.push({
      title: 'Fun Fact',
      description: toDescriptionString(funFact),
    })
  }
  if (pastExperience) {
    aboutMeItems.push({
      title: 'Past Experience',
      description: toDescriptionString(pastExperience),
    })
  }

  const cards = [
    {
      title: 'About Me',
      items: aboutMeItems,
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
