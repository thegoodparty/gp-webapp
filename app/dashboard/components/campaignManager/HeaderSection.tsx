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
    ? 'Primary Election'
    : 'General Election'

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-semibold font-opensans">
        Hi {user?.firstName}
      </h1>
      <div className="text-sm font-opensans">
        {timeUntilElection === 'election-day'
          ? 'Today is Election Day!'
          : timeUntilElection &&
            `${timeUntilElection} until your ${electionLabel}`}
      </div>
    </div>
  )
}
