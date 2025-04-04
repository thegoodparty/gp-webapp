'use client'

import H2 from '@shared/typography/H2'
import { numberFormatter } from 'helpers/numberHelper'
import { FaBullhorn } from 'react-icons/fa'
import { RiDoorOpenLine, RiPhoneLine } from 'react-icons/ri'

const cards = [
  {
    key: 'doorKnocking',
    title: 'Doors knocked',
    icon: <RiDoorOpenLine size={36} className="opacity-20 mb-3" />,
  },
  {
    key: 'calls',
    title: 'Calls made',
    icon: <RiPhoneLine size={36} className="opacity-20 mb-3" />,
  },
  {
    key: 'digital',
    title: 'Online impressions',
    icon: <FaBullhorn size={36} className="opacity-20 mb-3" />,
  },
]

export default function TrackerStats(props) {
  const { campaign } = props
  const { reportedVoterGoals, pathToVictory } = campaign
  if (!reportedVoterGoals) {
    return <div className="my-4 text-xl">No reported voter goals</div>
  }

  const { voterContactGoal, voteGoal } = pathToVictory || {}
  let resolvedContactGoal = voterContactGoal ?? voteGoal * 5

  return (
    <div className="grid grid-cols-12 gap-6">
      {cards.map((card) => (
        <div className=" col-span-12 md:col-span-4" key={card.key}>
          <div className="relative text-white bg-gradient-to-b from-indigo-300 via-indigo-500 to-black h-48 rounded-lg flex items-center justify-center flex-col text-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
            {card.icon}
            <H2>
              {card.title}
              <br />
              {numberFormatter(reportedVoterGoals[card.key])}
            </H2>
          </div>
        </div>
      ))}
      <div className=" col-span-12">
        <div className="relative bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-purple-200 via-purple-400 to-purple-800 h-48 rounded-lg flex items-center justify-center flex-col text-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <H2 className="text-white">
            Total Contact Goals:
            <br />
            <div className=" text-6xl mt-3">
              {numberFormatter(resolvedContactGoal)}
            </div>
          </H2>
        </div>
      </div>
    </div>
  )
}
