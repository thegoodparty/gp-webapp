import ReadMoreCard from './ReadMoreCard'
import ScheduleCard from './ScheduleCard'
import ScriptCard from './ScriptCard'

interface ActionCardsProps {
  type: string
  isCustom: boolean
  [key: string]: string | number | boolean | undefined
}

const cardsByType = (type: string, props: ActionCardsProps): React.JSX.Element[] => {
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

export default function ActionCards(props: ActionCardsProps): React.JSX.Element | null {
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
