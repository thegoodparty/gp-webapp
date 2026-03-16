import { differenceInDays, differenceInWeeks } from 'date-fns'
import H1 from '@shared/typography/H1'

interface CampaignCountdownProps {
  electionDate?: string
}

interface RenderCountdownProps {
  date: string
}

const RenderCountdown = (props: RenderCountdownProps): React.JSX.Element => {
  const today = new Date().toISOString().split('T')[0]
  const weeks = today ? differenceInWeeks(props.date!, today) : 0
  const days = today ? differenceInDays(props.date!, today) : 0

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

export const CampaignCountdown = ({
  electionDate,
}: CampaignCountdownProps): React.JSX.Element | null => {
  if (!electionDate || electionDate === '') {
    return null
  }

  return <RenderCountdown date={electionDate} />
}
