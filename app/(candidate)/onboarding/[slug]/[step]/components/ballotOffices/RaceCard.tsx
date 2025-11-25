import { GrRadial, GrRadialSelected } from 'react-icons/gr'
import Body2 from '@shared/typography/Body2'
import { dateUsHelper } from 'helpers/dateHelper'
import H5 from '@shared/typography/H5'

interface Position {
  name: string
  normalizedPosition?: {
    name: string
  }
}

interface Election {
  electionDay: string
  primaryElectionDate?: string
}

interface Race {
  position: Position
  election: Election
}

interface RaceCardProps {
  race: Race
  selected: boolean
  selectCallback: (race: Race) => void
}

export default function RaceCard({ race, selected, selectCallback }: RaceCardProps): React.JSX.Element | null {
  const { position, election } = race
  if (!position) {
    return null
  }
  const { name, normalizedPosition } = position
  const { electionDay, primaryElectionDate } = election

  const handleKeyDown = (e: React.KeyboardEvent, race: Race) => {
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
        <div className="ml-3 text-left">
          <H5>{name}</H5>
          <Body2>{normalizedPosition?.name || ''}</Body2>
          <Body2 className="">
            Election Date: {dateUsHelper(electionDay)}{' '}
            {primaryElectionDate ? (
              <span>
                | Primary Election Date: {dateUsHelper(primaryElectionDate)}
              </span>
            ) : (
              ''
            )}
          </Body2>
        </div>
      </div>
    </div>
  )
}

