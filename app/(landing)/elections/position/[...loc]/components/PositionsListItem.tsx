'use client'
import { useState } from 'react'
import { SlArrowDown, SlArrowRight } from 'react-icons/sl'
import Button from '@shared/buttons/Button'

interface PositionsListItemProps {
  positions?: string[]
}

export const PositionsListItem = ({ positions = [] }: PositionsListItemProps): React.JSX.Element => {
  const [expandPositions, setExpandPositions] = useState(false)
  const enableShowMore = positions.length > 5
  return (
    <li className="leading-loose">
      Positions:{' '}
      {enableShowMore && (
        <Button
          color="neutral"
          onClick={() => setExpandPositions(!expandPositions)}
          size="small"
        >
          <span className="inline-block align-middle leading-6">Show All</span>
          {!expandPositions ? (
            <SlArrowRight className="inline-block ml-2 align-middle" />
          ) : (
            <SlArrowDown className="inline-block ml-2 align-middle" />
          )}
        </Button>
      )}
      <span className="font-normal">
        {positions
          .slice(0, !expandPositions ? 5 : undefined)
          .map((position) => (
            <div key={position} className="mb-1">
              {position}
            </div>
          ))}
        {enableShowMore && !expandPositions && <span>...</span>}
      </span>
    </li>
  )
}
