import React from 'react'
import Link from 'next/link'

import {
  candidateColor,
  partyRace,
  candidateRoute,
} from 'helpers/candidateHelper'

import BlackButton from '../buttons/BlackButton'
import CandidateProgressBar from './CandidateProgressBar'
import CandidateAvatar from './CandidateAvatar'

const MAX_POSITIONS = 6

interface Position {
  id: string
  name: string
}

interface Followers {
  thisWeek: number
}

interface Support {
  thisWeek: number
}

interface Candidate {
  firstName: string
  lastName: string
  slug?: string
  positions?: Position[]
  whyRunning?: string
  whyIndependent?: string
  experience?: string
  hometown?: string
  occupation?: string
  funFact?: string
  didWin?: string
  followers?: Followers
  support?: Support
  image?: string
  raceDate?: string
  votesNeeded?: number
  overrideFollowers?: boolean
  likelyVoters?: number
  votesReceived?: number
}

interface LargeCardProps {
  candidate: Candidate
  priority?: boolean
}

const LargeCard = ({ candidate, priority = false }: LargeCardProps): React.JSX.Element => {
  if (!candidate) {
    return <></>
  }
  const {
    firstName,
    lastName,
    positions,
    whyRunning,
    whyIndependent,
    experience,
    hometown,
    occupation,
    funFact,
    didWin,
    followers,
    support,
  } = candidate

  const brightColor = candidateColor(candidate)
  let topPositions = positions

  if (positions && positions.length > MAX_POSITIONS) {
    topPositions = positions.slice(0, MAX_POSITIONS)
  }

  const showCard = hometown || occupation || funFact

  let thisWeek = 0
  if (followers) {
    thisWeek = followers.thisWeek + (support ? support.thisWeek : 0)
  }

  return (
    <Link
      href={candidateRoute(candidate?.slug)}
      style={{ height: '100%' }}
      className="no-underline candidate-card"
      data-cy="candidate-link"
      id={`candidate-card-${firstName}-${lastName}`}
    >
      <div className="rounded-2xl py-4 px-9 border-2 border-gray-200 h-full relative bg-white mb-6">
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex justify-center lg:mt-12">
              <CandidateAvatar candidate={candidate} priority={priority} />
            </div>
          </div>
          <div className="lg:col-span-5 lg:pl-6">
            <div className="mt-4">
              <div className="font-bold text-sm h-8 overflow-hidden mb-2">
                {topPositions && topPositions.length > 0 && (
                  <>
                    {topPositions.map((position) => (
                      <React.Fragment key={position?.id}>
                        {position && (
                          <div
                            className="inline-block py-1 px-3 rounded text-xs bg-zinc-100 mt-1 mr-1"
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
            </div>
            <div
              className="text-3xl font-black mb-2 lg:text-5xl"
              data-cy="candidate-name"
            >
              {firstName} {lastName}
            </div>
            <div className="text-neutral-600" data-cy="candidate-party">
              {partyRace(candidate)}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="mt-6 lg:mt-14">
              <CandidateProgressBar
                candidate={candidate}
                peopleSoFar={thisWeek}
              />
              <div className="mt-8">
                <BlackButton
                  style={{
                    backgroundColor: brightColor,
                    borderColor: brightColor,
                    width: '100%',
                  }}
                  data-cy="candidate-view"
                >
                  <strong>
                    {didWin === 'Yes'
                      ? 'VIEW ISSUES'
                      : didWin === 'No'
                      ? 'VIEW 2022 CAMPAIGN'
                      : 'VIEW CAMPAIGN'}
                  </strong>
                </BlackButton>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3"></div>
          <div className="lg:col-span-9">
            {showCard && (
              <div className="mt-9 lg:shadow-md lg:rounded-md lg:py-6 lg:px-5 lg:mt-0 lg:inline-block">
                {hometown && (
                  <div className="mb-2 text-xs">
                    <strong>Home Town &amp; State:</strong> {hometown}
                  </div>
                )}
                {occupation && (
                  <div className="mb-2 text-xs">
                    <strong>Current Occupation:</strong> {occupation}
                  </div>
                )}
                {funFact && (
                  <div className="mb-2 text-xs">
                    <strong>Fun Fact:</strong> {funFact}
                  </div>
                )}
              </div>
            )}
            {whyRunning && (
              <div className="mt-9 text-xs lg:text-sm">
                <strong>Why I&apos;m running</strong>: {whyRunning}
              </div>
            )}

            {whyIndependent && (
              <div className="mt-6 text-xs lg:text-sm">
                <strong>Why I&apos;m Independent</strong>: {whyIndependent}
              </div>
            )}

            {experience && (
              <div className="mt-6 text-xs lg:text-sm">
                <strong>Prior Experience</strong>: {experience}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default LargeCard

