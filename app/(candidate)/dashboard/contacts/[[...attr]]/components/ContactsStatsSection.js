import Paper from '@shared/utils/Paper'
import Body2 from '@shared/typography/Body2'
import { generateCards } from './shared/stats.util'

export default function ContactsStatsSection({ peopleStats }) {
  const cards = generateCards(peopleStats)

  return (
    <section className="mt-4 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {cards.map((card) => (
        <Paper key={card.key}>
          <div className="flex items-center gap-4 justify-between">
            <Body2 className="font-medium">{card.label}</Body2>
            <div>{card.icon}</div>
          </div>

          <h4 className="font-bold mt-1 text-2xl">{card.value}</h4>
        </Paper>
      ))}
    </section>
  )
}
