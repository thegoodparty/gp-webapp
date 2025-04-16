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
      <strong>
        {numberFormatter(getVoterContactsTotal(reportedVoterGoals))} voter
        contacts
      </strong>{' '}
      out of{' '}
      <strong>
        {numberFormatter(getVoterContactsGoal(pathToVictory))} needed to win
      </strong>
      .
    </H4>
  )
}
