'use client'
import H4 from '@shared/typography/H4'
import { numberFormatter } from 'helpers/numberHelper'
import {
  getVoterContactsGoal,
  getVoterContactsTotal,
} from 'app/(candidate)/dashboard/components/voterGoalsHelpers'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'

interface PathToVictoryData {
  voterContactGoal?: number
  voteGoal?: number
}

interface VoterContactsCountProps {
  pathToVictory: PathToVictoryData
}

export const VoterContactsCount = ({
  pathToVictory,
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
        {numberFormatter(
          getVoterContactsGoal(pathToVictory as { voterContactGoal: number; voteGoal: number }),
        )}{' '}
        needed to win
      </span>
      .
    </H4>
  )
}
