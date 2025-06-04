import OutreachCreateCard from './OutreachCreateCard'
import {
  IMPACTS_LEVELS,
  OUTREACH_TYPES,
} from 'app/(candidate)/dashboard/outreach/constants'

const OUTREACH_OPTIONS = [
  {
    title: 'Text message',
    impact: IMPACTS_LEVELS.medium,
    cost: '$.035/msg',
    type: OUTREACH_TYPES.p2pTexting,
  },
  {
    title: 'Robocall',
    impact: IMPACTS_LEVELS.medium,
    cost: '$.045/msg',
    type: OUTREACH_TYPES.robocall,
  },
  {
    title: 'Door knocking',
    impact: IMPACTS_LEVELS.high,
    cost: 'Free',
    type: OUTREACH_TYPES.doorKnocking,
  },
  {
    title: 'Phone banking',
    impact: IMPACTS_LEVELS.medium,
    cost: 'Free',
    type: OUTREACH_TYPES.phoneBanking,
  },
  {
    title: 'Social post',
    impact: IMPACTS_LEVELS.low,
    cost: 'Free',
    type: OUTREACH_TYPES.social,
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
        mb-12
      "
    >
      {OUTREACH_OPTIONS.map(({ title, impact, cost, type }) => (
        <OutreachCreateCard {...{ key: type, type, title, impact, cost }} />
      ))}
    </div>
  )
}
