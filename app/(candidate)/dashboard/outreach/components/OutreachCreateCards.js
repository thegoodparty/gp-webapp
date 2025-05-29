import OutreachCreateCard from './OutreachCreateCard'
import { IMPACTS_LEVELS } from 'app/(candidate)/dashboard/outreach/consts'

const OUTREACH_OPTIONS = [
  {
    title: 'Text message',
    impact: IMPACTS_LEVELS.medium,
    cost: '$.035/msg',
    key: 'sms',
  },
  {
    title: 'Robocall',
    impact: IMPACTS_LEVELS.medium,
    cost: '$.045/msg',
    key: 'robocall',
  },
  {
    title: 'Door knocking',
    impact: IMPACTS_LEVELS.high,
    cost: 'Free',
    key: 'door',
  },
  {
    title: 'Phone banking',
    impact: IMPACTS_LEVELS.medium,
    cost: 'Free',
    key: 'phone',
  },
  {
    title: 'Social post',
    impact: IMPACTS_LEVELS.low,
    cost: 'Free',
    key: 'social',
  },
]

export default function OutreachCreateCards() {
  return (
    <div
      className="
        w-full
        grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-3
        xl:grid-cols-5
        gap-4
        md:gap-6
        justify-center
        bg-gray-200
        rounded-2xl
        p-4
        md:p-6
      "
    >
      {OUTREACH_OPTIONS.map(({ title, impact, cost, key }) => (
        <OutreachCreateCard
          key={key}
          title={title}
          impact={impact}
          cost={cost}
        />
      ))}
    </div>
  )
}
