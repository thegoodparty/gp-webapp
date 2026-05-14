import { GrRadial, GrRadialSelected } from 'react-icons/gr'
import { LoaderCircle } from 'lucide-react'
import Body2 from '@shared/typography/Body2'
import { dateUsHelper } from 'helpers/dateHelper'
import H5 from '@shared/typography/H5'
import { RaceWithHighlight } from './types'

interface RaceCardProps {
  race: RaceWithHighlight
  selected: boolean
  isHydrating?: boolean
  selectCallback: (race: { id: string }) => void
}

export default function RaceCard({
  race,
  selected,
  isHydrating,
  selectCallback,
}: RaceCardProps): React.JSX.Element | null {
  const { position, election } = race
  if (!position) {
    return null
  }
  const { name, normalizedPosition } = position
  const { electionDay } = election

  const handleKeyDown = (e: React.KeyboardEvent, race: RaceWithHighlight) => {
    if (e.key === 'Enter') {
      selectCallback(race)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`px-4 py-4 bg-indigo-50 rounded-md mb-4 items-center justify-between cursor-pointer transition-colors hover:bg-slate-200 border ${
        selected ? 'border-black' : 'border-gray-200'
      }`}
      onClick={() => selectCallback(race)}
      onKeyDown={(e) => handleKeyDown(e, race)}
    >
      <div className="flex items-center">
        {selected ? (
          <GrRadialSelected className="text-primary text-xl" />
        ) : (
          <GrRadial className="text-xl text-indigo" />
        )}
        {isHydrating ? (
          <LoaderCircle size={16} className="ml-2 animate-spin" />
        ) : null}
        <div className="ml-3 text-left">
          <H5>{name}</H5>
          <Body2>{normalizedPosition?.name || ''}</Body2>
          <Body2 className="">Election Date: {dateUsHelper(electionDay)}</Body2>
        </div>
      </div>
    </div>
  )
}
