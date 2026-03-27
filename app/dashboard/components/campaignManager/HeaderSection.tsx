'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { getNextElection } from 'helpers/campaignHelper'
import { timeToNextElection } from 'helpers/dateHelper'

export default function HeaderSection() {
  const [user] = useUser()
  const [campaign] = useCampaign()

  const nextElection = getNextElection(campaign ?? null)
  const timeUntilElection = timeToNextElection(nextElection?.nextElectionDate)
  const electionLabel = nextElection?.isPrimary
    ? 'Primary Election Day'
    : 'General Election Day'

  return (
    <h1 className="text-4xl font-semibold mb-8">
      {timeUntilElection
        ? `${timeUntilElection} until ${electionLabel}`
        : 'Hello'}
      , {user?.firstName}
    </h1>
  )
}
