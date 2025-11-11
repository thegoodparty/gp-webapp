import React from 'react'
import { shortToLongState } from 'helpers/statesHelper'

interface Candidate {
  slug?: string
  party?: string
  otherParty?: string
  race?: string
  office?: string
  state?: string
  district?: string
  counties?: string
  color?: { color?: string }
  hashtag?: string
  firstName?: string
  lastName?: string
  [key: string]: unknown
}

export const partyResolver = (partyLetter: string | undefined, otherParty?: string): string => {
  if (!partyLetter) {
    return ''
  }
  if (partyLetter === 'Other' && otherParty) {
    return otherParty
  }
  if (partyLetter === 'D') {
    return 'Democratic'
  }
  if (partyLetter === 'R') {
    return 'Republican'
  }
  if (partyLetter === 'GP') {
    return 'Green'
  }
  if (partyLetter === 'LP' || partyLetter === 'L') {
    return 'Libertarian'
  }
  if (partyLetter === 'LI') {
    return 'Liberation'
  }
  if (partyLetter === 'I') {
    return 'Independent'
  }
  if (partyLetter === 'VC') {
    return 'Vetting Challengers'
  }
  if (partyLetter === 'U') {
    return 'Unity'
  }
  if (partyLetter === 'UUP') {
    return 'United Utah'
  }
  if (partyLetter === 'W') {
    return 'Working Families'
  }
  if (partyLetter === 'S') {
    return 'SAM'
  }
  if (partyLetter === 'F') {
    return 'Forward'
  }
  return partyLetter
}

export const candidateRoute = (candidate: Candidate | null | undefined): string => {
  if (!candidate) {
    return '/'
  }
  const { slug } = candidate
  return `/candidate/${slug}`
}

export const partyRace = (candidate: Candidate): React.ReactNode => {
  const { party, otherParty, race, office, state, district, counties } = candidate
  let resolvedRace = ''

  if (office) {
    resolvedRace = `${office} ${state ? `(${shortToLongState[state as keyof typeof shortToLongState]})` : ''}  ${
      district ? `| District ${district}` : ''
    }`
  } else {
    resolvedRace = race || ''
  }
  return (
    <>
      {partyResolver(party, otherParty)} | {resolvedRace}
      {counties && (
        <div style={{ marginTop: '7px', color: '#868686' }}>
          <strong>Counties Served</strong>: {counties}
        </div>
      )}
    </>
  )
}

export const candidateColor = (candidate: Candidate): string => {
  const { color } = candidate
  if (color?.color) {
    return color.color
  }
  return '#000'
}



