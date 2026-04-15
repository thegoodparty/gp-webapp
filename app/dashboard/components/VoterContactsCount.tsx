'use client'
import H4 from '@shared/typography/H4'
import { numberFormatter } from 'helpers/numberHelper'
import {
  getVoterContactsGoal,
  getVoterContactsTotal,
} from 'app/dashboard/components/voterGoalsHelpers'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { RaceTargetMetrics } from 'helpers/types'

interface VoterContactsCountProps {
  raceTargetMetrics?: RaceTargetMetrics | null
}

export const VoterContactsCount = ({
  raceTargetMetrics,
}: VoterContactsCountProps): React.JSX.Element => {
  const [reportedVoterGoals] = useVoterContacts()
  return (
    <H4>
      Your actions so far have earned you{' '}
      <span className="font-bold">
        {numberFormatter(getVoterContactsTotal(reportedVoterGoals))} voter
        contacts
      </span>{' '}
      out of{' '}
      <span className="font-bold">
        {numberFormatter(getVoterContactsGoal(raceTargetMetrics))} needed to win
      </span>
      .
    </H4>
  )
}
