import { ReactNode } from 'react'

export interface RacePosition {
  id?: string
  name: string
  level?: string
  state?: string
  partisanType?: string
  hasPrimary?: boolean
  electionFrequencies?: { frequency: number }[]
  normalizedPosition?: {
    name: string
  }
  mtfcc?: string | null
  geoId?: string | null
  subAreaName?: string | null
  subAreaValue?: string | null
  tier?: string | number | null
}

export interface RacePositionWithHighlight extends Omit<RacePosition, 'name'> {
  name: ReactNode
}

export interface RaceElection {
  id?: string
  electionDay: string
  primaryElectionDate?: string
  primaryElectionId?: string
  state?: string
  name?: string | null
  timezone?: string | null
}

export interface FilingPeriod {
  startOn: string
  endOn: string
}

export interface Race {
  id: string
  brPositionId?: string
  position: RacePosition
  election: RaceElection
  filingPeriods?: FilingPeriod[]
  city?: string | null
  isPrimary?: boolean | null
}

export interface RaceWithHighlight extends Omit<Race, 'position'> {
  position: RacePositionWithHighlight
}
