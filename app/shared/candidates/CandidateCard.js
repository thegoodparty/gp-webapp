import React from 'react'
import Link from 'next/link'
import {
  candidateColor,
  candidateRoute,
  partyRace,
} from 'helpers/candidateHelper'
import BlackButton from '../buttons/BlackButton'
import CandidateAvatar from './CandidateAvatar'
import CandidateProgressBar from './CandidateProgressBar'

const MAX_POSITIONS = 6

export default function CandidateCard({ candidate, withFollowButton = false }) {
  if (!candidate) {
    return <></>
  }
  const { firstName, lastName, positions, followers, support } = candidate

  const brightColor = candidateColor(candidate)
  let topPositions = positions

  if (positions && positions.length > MAX_POSITIONS) {
    topPositions = positions.slice(0, MAX_POSITIONS)
  }

  const WrapperElement = ({ children }) => {
    if (withFollowButton) {
      return (
        <div
          id={`candidate-card-${firstName}-${lastName}`}
          className="candidate-card"
        >
          {children}
        </div>
      )
    }
    return (
      <Link
        href={candidateRoute(candidate)}
        passHref
        style={{ height: '100%' }}
        className="no-underline candidate-card"
        data-cy="candidate-link"
        id={`candidate-card-${firstName}-${lastName}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <WrapperElement>
      <div className="rounded-2xl py-6 px-6 border-2 border-solid border-gray-200 h-full relative bg-white">
        <div className="flex justify-center">
          <CandidateAvatar candidate={candidate} small />
        </div>
        <h3 className="text-xl font-bold mb-2 mt-6">
          {firstName} {lastName}
        </h3>
        <div className="text-neutral-600">{partyRace(candidate)}</div>
        <div className="mt-4  text-sm h-14 overflow-hidden">
          {topPositions && topPositions.length > 0 && (
            <>
              {topPositions.map((position) => (
                <React.Fragment key={position?.id}>
                  {position && (
                    <div
                      className="inline-block px-2 py-1 rounded text-xs bg-zinc-100 mt-1 mr-1 font-bold"
                      key={position.id}
                      data-cy="position"
                    >
                      {position.name}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
        <div className="mt-8 mb-1">
          <CandidateProgressBar candidate={candidate} />
        </div>
        <div
          className="absolute left-6 bottom-6"
          style={{ width: 'calc(100% - 48px)' }}
        >
          {withFollowButton ? (
            // <div>Follow container here</div>
            <div></div>
          ) : (
            <BlackButton
              fullWidth
              className="view-button-card"
              style={{
                backgroundColor: brightColor,
                borderColor: brightColor,
                width: '100%',
              }}
              data-cy="candidate-view"
            >
              <strong>VIEW CAMPAIGN</strong>
            </BlackButton>
          )}
        </div>
      </div>
    </WrapperElement>
  )
}
