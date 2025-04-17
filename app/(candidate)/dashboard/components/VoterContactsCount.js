'use client'
import H4 from '@shared/typography/H4'
import { numberFormatter } from 'helpers/numberHelper'
import {
  getVoterContactsGoal,
  getVoterContactsTotal,
} from 'app/(candidate)/dashboard/components/voterGoalsHelpers'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'

export const VoterContactsCount = ({ pathToVictory }) => {
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
        {numberFormatter(getVoterContactsGoal(pathToVictory))} needed to win
      </span>
      .
    </H4>
  )
}
