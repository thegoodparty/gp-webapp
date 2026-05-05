export type OnboardingStepId =
  | 'welcome'
  | 'ballot-status'
  | 'party-affiliation'
  | 'office-selection'
  | 'manual-office-entry'
  | 'path-to-victory'
  | 'candidate-issues'
  | 'community-cares'
  | 'community-alignment'
  | 'minimum-budget'
  | 'pledge'

export type OnboardingOfficePath = 'structured' | 'manual'

export type BallotStatus =
  | 'on-ballot'
  | 'qualified-not-filed'
  | 'considering'
  | 'testing'

export type PartyAffiliation =
  | 'nonpartisan'
  | 'independent-or-non-major'
  | 'democrat'
  | 'republican'

export type OnboardingJsonValue =
  | string
  | number
  | boolean
  | null
  | OnboardingJsonValue[]
  | { [key: string]: OnboardingJsonValue }

export interface OnboardingAnswers {
  [key: string]: OnboardingJsonValue | undefined
  officePath?: OnboardingOfficePath
  manualOffice?: boolean
  unmatchedOffice?: boolean
  hasZipOnlyCommunityData?: boolean
  ballotStatus?: BallotStatus
  partyAffiliation?: PartyAffiliation
}

export interface NewOnboardingStepContext {
  answers: OnboardingAnswers
}

export interface NewOnboardingStep {
  id: OnboardingStepId
  eyebrow: string
  title: string
  description: string
  summary: string
  whyWeAsk?: string
  shouldSkip?: (context: NewOnboardingStepContext) => boolean
  isValid?: (context: NewOnboardingStepContext) => boolean
}

export interface NewOnboardingPayload {
  version: 1
  officeSelection: {
    mode: OnboardingOfficePath | null
    manualOffice: boolean
    unmatchedOffice: boolean
  }
  answers: OnboardingAnswers
}

export type NonEmptyArray<T> = readonly [T, ...T[]]
