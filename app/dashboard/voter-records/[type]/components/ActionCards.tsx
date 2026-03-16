import ReadMoreCard from './ReadMoreCard'
import ScheduleCard from './ScheduleCard'
import ScriptCard from './ScriptCard'
import { Campaign } from 'helpers/types'

interface ActionCardsProps {
  type: string
  isCustom: boolean
  campaign: Campaign
  fileName?: string
}

const cardsByType = (
  type: string,
  props: ActionCardsProps,
): React.JSX.Element[] => {
  let cards: React.JSX.Element[] = []
  if (type === 'sms' || type === 'telemarketing') {
    cards = [
      <ScriptCard {...props} key="card1" />,
      <ScheduleCard {...props} key="card2" />,
      <ReadMoreCard {...props} key="card3" />,
    ]
  }
  if (
    type === 'directmail' ||
    type === 'doorknocking' ||
    type === 'digitalads'
  ) {
    cards = [
      <ScriptCard {...props} key="card1" />,
      <ReadMoreCard {...props} key="card3" />,
    ]
  }
  return cards
}

const ActionCards = (props: ActionCardsProps): React.JSX.Element | null => {
  const { type, isCustom } = props
  if (isCustom) {
    return null
  }

  const cards = cardsByType(type, props)

  return (
    <div className="mt-4 grid grid-cols-12 gap-4">
      {cards.map((card, index) => (
        <div
          className={`col-span-12  h-full ${
            cards.length === 3 ? 'md:col-span-4' : 'md:col-span-6'
          }`}
          key={index}
        >
          {card}
        </div>
      ))}
    </div>
  )
}

export default ActionCards
