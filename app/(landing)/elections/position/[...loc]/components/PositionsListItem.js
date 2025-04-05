'use client'
import { useState } from 'react'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import { SlArrowDown, SlArrowRight } from 'react-icons/sl'

export const PositionsListItem = ({ positions = [] }) => {
  const [expandPositions, setExpandPositions] = useState(false)
  const enableShowMore = positions.length > 5
  return (
    <li className="leading-loose">
      Positions:{' '}
      {enableShowMore && (
        <SecondaryButton
          className={{
            'align-middle': true,
          }}
          onClick={() => setExpandPositions(!expandPositions)}
          size="small"
        >
          <span className="inline-block align-middle leading-6">Show All</span>
          {!expandPositions ? (
            <SlArrowRight className="inline-block ml-2 align-middle" />
          ) : (
            <SlArrowDown className="inline-block ml-2 align-middle" />
          )}
        </SecondaryButton>
      )}
      <span className="font-normal">
        {positions
          .slice(0, !expandPositions ? 5 : undefined)
          .map((position) => (
            <div key={position}>{position}</div>
          ))}
        {enableShowMore && !expandPositions && <span>...</span>}
      </span>
    </li>
  )
}
