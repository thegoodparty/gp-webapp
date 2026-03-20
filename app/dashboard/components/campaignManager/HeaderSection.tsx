'use client'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useUser } from '@shared/hooks/useUser'
import { timeToNextElection } from 'helpers/dateHelper'

export default function HeaderSection() {
  const [user] = useUser()
  const [campaign] = useCampaign()

  const timeUntilElection = timeToNextElection(campaign)

  return (
    <h1 className="text-4xl font-semibold mb-8">
      {timeUntilElection || 'Hello'}, {user?.firstName}
    </h1>
  )
}
