'use client'
import React, { useState, useEffect } from 'react'
import { IoIosCheckmark } from 'react-icons/io'

import { numberFormatter } from 'helpers/numberHelper'
import { candidateColor } from 'helpers/candidateHelper'
import { daysTill } from 'helpers/dateHelper'

interface Candidate {
  firstName: string
  lastName: string
  raceDate?: string
  votesNeeded?: number
  overrideFollowers?: boolean
  likelyVoters?: number
  didWin?: string
  votesReceived?: number
}

interface CandidateProgressBarProps {
  candidate: Candidate
  peopleSoFar?: number
  withAchievement?: boolean
  withAnimation?: boolean
}

const CandidateProgressBar = ({
  candidate,
  peopleSoFar,
  withAchievement,
  withAnimation = true,
}: CandidateProgressBarProps): React.JSX.Element => {
  const {
    raceDate,
    votesNeeded,
    firstName,
    lastName,
    overrideFollowers,
    likelyVoters,
    didWin,
    votesReceived,
  } = candidate
  const offsetFollow = 0

  let people = overrideFollowers ? likelyVoters || 0 : peopleSoFar || 0
  people += offsetFollow
  const color = candidateColor(candidate)
  const daysResult = daysTill(raceDate)
  const days = typeof daysResult === 'string' ? parseInt(daysResult) || 0 : daysResult

  const [barWidth, setBarWidth] = useState(0)
  const [isRendered, setIsRendered] = useState(false)
  const weeksToElection = Math.ceil(days / 7)

  let progress = 0
  let realPerc = 0
  if (votesNeeded && votesNeeded !== 0) {
    progress = Math.floor((100 * people) / votesNeeded)
    realPerc = Math.floor((100 * people) / votesNeeded)
  }

  if (!progress) {
    progress = 50
  } else if (progress > 100) {
    progress = 100
  } else if (progress < 50) {
    progress = 50
  }

  const daysTillElectionResult = daysTill(raceDate)
  const daysTillElection = typeof daysTillElectionResult === 'string' ? parseInt(daysTillElectionResult) || 0 : daysTillElectionResult

  let raceDone = false
  if (raceDate) {
    if (daysTillElection < 0) {
      raceDone = true
    }
  }

  if (raceDone && votesReceived && votesNeeded && votesNeeded !== 0) {
    progress = (votesReceived * 100) / votesNeeded
    if (progress > 100) {
      progress = 100
    }
  }

  useEffect(() => {
    if (withAnimation && !isRendered) {
      setTimeout(() => {
        setBarWidth(50)
      }, 100)

      setTimeout(() => {
        setBarWidth(progress)
      }, 2000)
    } else {
      setBarWidth(progress)
    }
    setIsRendered(true)
  }, [votesNeeded, progress, withAnimation, isRendered])

  let achievementIcon: React.ReactNode = (
    <img
      className="w-8 h-8 mr-2"
      src="/images/icons/achievement.svg"
      alt="achievement"
    />
  )
  let achievementText: React.ReactNode = (
    <div>
      {firstName} {lastName} has <strong>{numberFormatter(realPerc)}%</strong>{' '}
      of the votes needed to win this race
    </div>
  )
  if (raceDone && didWin === 'Yes') {
    achievementIcon = (
      <span className="text-xl mr-2" role="img" aria-label="Party">
        🎉️
      </span>
    )
    const resultPerc =
      votesNeeded && votesNeeded !== 0 ? (votesReceived || 0) * 100 / votesNeeded : 0
    achievementText = (
      <div>
        {firstName} {lastName} received{' '}
        <strong>{numberFormatter(resultPerc)}%</strong> of the votes needed and
        won this election!
      </div>
    )
  } else if (raceDone && didWin === 'No') {
    achievementIcon = (
      <span className="text-xl mr-2" role="img" aria-label="Ballot Box">
        🗳️
      </span>
    )
    const resultPerc =
      votesNeeded && votesNeeded !== 0 ? (votesReceived || 0) * 100 / votesNeeded : 0
    achievementText = (
      <div>
        {firstName} {lastName} received{' '}
        <strong>{numberFormatter(resultPerc)}%</strong> of the votes needed and
        did not win this election
      </div>
    )
  } else if (raceDone) {
    achievementIcon = (
      <span className="text-xl mr-2" role="img" aria-label="Ballot Box">
        🗳️
      </span>
    )
    achievementText = <div>Election ended, awaiting results...</div>
  }
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          {raceDone && (didWin === 'Yes' || didWin === 'No') ? (
            <>
              <div className="text-lg font-black">
                {numberFormatter(votesReceived || 0)}
              </div>
              <div className="text-sm">votes received</div>
            </>
          ) : (
            <>
              <div className="text-lg font-black">
                {numberFormatter(people)}
              </div>
              <div className="text-sm">likely voters</div>
            </>
          )}
        </div>

        <div className="text-center">
          {raceDone ? (
            <>
              {didWin === 'Yes' && (
                <div>
                  <strong>
                    <div>
                      Won{' '}
                      <span role="img" aria-label="Party">
                        🎉
                      </span>
                    </div>{' '}
                    election
                  </strong>
                </div>
              )}
              {didWin === 'No' && (
                <div>
                  <strong>
                    <div>Did not win</div> election
                  </strong>
                </div>
              )}

              {didWin !== 'Yes' && didWin !== 'No' && (
                <div>
                  <strong>
                    <div>Awaiting</div> results
                  </strong>
                </div>
              )}
            </>
          ) : (
            <>
              {daysTillElection === 0 ? (
                <div className="text-lg font-black">Election day</div>
              ) : (
                <>
                  <div className="text-lg font-black">
                    {weeksToElection > 1 ? (
                      <>
                        {numberFormatter(weeksToElection)} week
                        {weeksToElection !== 1 ? 's' : ''}
                      </>
                    ) : (
                      <>
                        {daysTillElection} day
                        {daysTillElection !== 1 ? 's' : ''}
                      </>
                    )}
                  </div>
                  <div className="text-sm">until election</div>
                </>
              )}
            </>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-black">
            {numberFormatter(votesNeeded || 0)}
          </div>
          <div className="text-sm">votes needed</div>
        </div>
      </div>
      <div className="flex flex-col items-center" data-cy="supporter-progress">
        <div className="mt-3 mb-1 relative h-5 bg-zinc-100 rounded-3xl w-full">
          <div
            className="absolute h-5 rounded-3xl bg-black l-0"
            style={{
              width: `${barWidth}%`,
              backgroundColor: color,
              transition: 'width 1s',
            }}
          />

          <div
            className="absolute text-4xl -ml-4  z-10 w-8 h-8 rounded-full flex items-center justify-center text-white border-solid border border-white "
            style={{
              left: `${barWidth}%`,
              backgroundColor: color,
              transition: 'left 1s',
              top: '-5px',
            }}
          >
            <IoIosCheckmark />
          </div>
        </div>
        {withAchievement && (
          <div className="flex items-center justify-start w-full text-zinc-700 pl-2 mt-3">
            {achievementIcon}
            {achievementText}
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidateProgressBar

