import { differenceInDays, differenceInWeeks } from 'date-fns'
import H1 from '@shared/typography/H1'

export const CampaignCountdown = ({ electionDate }) => {
  const today = new Date()
  const weeks = differenceInWeeks(electionDate, today)
  const days = differenceInDays(electionDate, today)

  const value = days > 13 ? weeks : days
  const unit = days > 13 ? 'week' : 'day'

  if (weeks === 0 && days === 0) {
    return <H1 className="mb-4">Today is Election Day!</H1>
  }

  return (
    <H1 className="mb-4 mt-4">
      {`${value} ${unit}${value > 1 ? 's' : ''} until Election Day!`}
    </H1>
  )
}
