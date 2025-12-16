/**
 * Shared type definitions for helper utilities and domain models
 * Based on Prisma schema definitions
 */

// ===== User Types =====

export enum UserRole {
  admin = 'admin',
  sales = 'sales',
  candidate = 'candidate',
  campaignManager = 'campaignManager',
  demo = 'demo',
}

export enum WhyBrowsing {
  considering = 'considering',
  learning = 'learning',
  test = 'test',
  else = 'else',
}

export interface UserMetaData {
  customerId?: string
  checkoutSessionId?: string | null
  accountType?: string | null
  lastVisited?: number
  sessionCount?: number
  isDeleted?: boolean
  fsUserId?: string
  whyBrowsing?: WhyBrowsing | null
  hubspotId?: string
  profile_updated_count?: number
  textNotifications?: boolean
  demoPersona?: boolean
}

export interface User {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  firstName?: string | null
  lastName?: string | null
  name?: string | null
  avatar?: string | null
  password?: string | null
  hasPassword: boolean
  email: string
  phone?: string | null
  zip?: string | null
  roles: UserRole[]
  metaData?: UserMetaData | null
  passwordResetToken?: string | null
}

export interface UserResponse {
  data: User
}

// ===== Campaign Types =====

export enum CampaignTier {
  WIN = 'WIN',
  LOSE = 'LOSE',
  TOSSUP = 'TOSSUP',
}

export interface CampaignGeoLocation {
  geoHash?: string
  lng?: number
  lat?: number
}

export interface CustomIssue {
  title: string
  position: string
}

export interface RunningAgainst {
  name: string
  party: string
  description: string
}

export interface CampaignDetails {
  state?: string
  ballotLevel?: string
  electionDate?: string
  primaryElectionDate?: string
  zip?: string
  knowRun?: 'yes' | null
  runForOffice?: 'yes' | 'no' | null
  pledged?: boolean
  isProUpdatedAt?: number
  customIssues?: CustomIssue[]
  runningAgainst?: RunningAgainst[]
  geoLocation?: CampaignGeoLocation
  geoLocationFailed?: boolean
  city?: string | null
  county?: string | null
  normalizedOffice?: string | null
  otherOffice?: string
  office?: string
  party?: string
  otherParty?: string
  district?: string
  raceId?: string
  level?: string | null
  noNormalizedOffice?: boolean
  website?: string
  pastExperience?: string | Record<string, string>
  occupation?: string
  funFact?: string
  campaignCommittee?: string
  statementName?: string
  subscriptionId?: string | null
  endOfElectionSubscriptionCanceled?: boolean
  subscriptionCanceledAt?: number | null
  subscriptionCancelAt?: number | null
  filingPeriodsStart?: string | null
  filingPeriodsEnd?: string | null
  officeTermLength?: string
  partisanType?: string
  priorElectionDates?: string[]
  positionId?: string | null
  electionId?: string | null
  tier?: string
  einNumber?: string | null
  wonGeneral?: boolean
}

export interface CampaignData {
  createdBy?: string
  slug?: string
  hubSpotUpdates?: Record<string, string>
  currentStep?: string
  launchStatus?: string
  lastVisited?: number
  claimProfile?: string
  customVoterFiles?: unknown[]
  reportedVoterGoals?: Record<string, unknown>
  textCampaignCount?: number
  lastStepDate?: string
  adminUserEmail?: string
  hubspotId?: string
  name?: string
}

export interface AiContentData {
  name: string
  content: string
  updatedAt: number
  inputValues?: Partial<Record<string, string>>
}

export interface CampaignAiContent {
  generationStatus?: Record<string, string>
  campaignPlanAttempts?: Record<string, number>
  [key: string]:
    | AiContentData
    | Partial<Record<string, string>>
    | Partial<Record<string, number>>
    | undefined
}

export interface Campaign {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  slug: string
  isActive: boolean
  isVerified?: boolean | null
  isPro?: boolean | null
  isDemo: boolean
  didWin?: boolean | null
  dateVerified?: Date | string | null
  tier?: CampaignTier | null
  formattedAddress?: string | null
  placeId?: string | null
  data: CampaignData
  details: CampaignDetails
  aiContent: CampaignAiContent
  vendorTsData: Record<string, unknown>
  userId: number
  canDownloadFederal: boolean
  completedTaskIds: string[]
  hasFreeTextsOffer: boolean
  // Public candidate profile properties
  firstName?: string
  lastName?: string
  image?: string
  claimed?: boolean
  positionName?: string
  raceId?: string
}
