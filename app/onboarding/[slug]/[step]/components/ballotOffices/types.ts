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
}

export interface FilingPeriod {
  startOn: string
  endOn: string
}

export interface Race {
  id: string
  position: RacePosition
  election: RaceElection
  filingPeriods?: FilingPeriod[]
}

export interface RaceWithHighlight extends Omit<Race, 'position'> {
  position: RacePositionWithHighlight
}
