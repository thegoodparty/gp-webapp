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

// ===== CampaignUpdateHistory Types =====

export enum CampaignUpdateHistoryType {
  doorKnocking = 'doorKnocking',
  calls = 'calls',
  digital = 'digital',
  directMail = 'directMail',
  digitalAds = 'digitalAds',
  text = 'text',
  events = 'events',
  yardSigns = 'yardSigns',
  robocall = 'robocall',
  phoneBanking = 'phoneBanking',
  socialMedia = 'socialMedia',
}

export interface CampaignUpdateHistory {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  campaignId: number
  userId: number
  user: User
  type: CampaignUpdateHistoryType
  quantity: number
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
  einSupportingDocument?: string | null
  wonGeneral?: boolean
  launchStatus?: string
  filedStatement?: string
}

export interface ReportedVoterGoals {
  doorKnocking?: number
  calls?: number
  digital?: number
  directMail?: number
  digitalAds?: number
  text?: number
  events?: number
  yardSigns?: number
  robocall?: number
  phoneBanking?: number
  socialMedia?: number
}

export interface CampaignData {
  createdBy?: string
  slug?: string
  hubSpotUpdates?: HubSpotUpdates
  currentStep?: string
  launchStatus?: string
  lastVisited?: number
  claimProfile?: string
  customVoterFiles?: CustomVoterFile[]
  reportedVoterGoals?: ReportedVoterGoals
  textCampaignCount?: number
  lastStepDate?: string
  adminUserEmail?: string
  hubspotId?: string
  name?: string
  p2vNotNeeded?: boolean
}

export interface HubSpotUpdates {
  past_candidate?: string
  incumbent?: string
  candidate_experience_level?: string
  final_viability_rating?: string
  primary_election_result?: string
  election_results?: string
  professional_experience?: string
  p2p_campaigns?: string
  p2p_sent?: string
  confirmed_self_filer?: string
  verified_candidates?: string
  date_verified?: string
  pro_candidate?: string
  filing_deadline?: string
  opponents?: string
}

export interface CustomVoterFile {
  id?: string
  name?: string
  url?: string
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

export interface ViabilityScore {
  score?: number
  tier?: string
}

export interface PathToVictoryData {
  p2vStatus?: string
  p2vAttempts?: number
  p2vCompleteDate?: string
  completedBy?: number
  electionType?: string
  electionLocation?: string
  voterContactGoal?: number
  winNumber?: number
  p2vNotNeeded?: boolean
  totalRegisteredVoters?: number
  republicans?: number
  democrats?: number
  indies?: number
  women?: number
  men?: number
  white?: number
  asian?: number
  africanAmerican?: number
  hispanic?: number
  averageTurnout?: number
  projectedTurnout?: number
  viability?: ViabilityScore
  source?: string
  districtId?: string
  districtManuallySet?: boolean
  officeContextFingerprint?: string
  voteGoal?: number
  voterProjection?: number
  budgetLow?: number
  budgetHigh?: number
  voterMap?: string
  finalVotes?: number
}

export interface PathToVictory {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  campaignId: number
  data: PathToVictoryData
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
  vendorTsData: VendorTsData
  pathToVictory?: PathToVictory
  user?: User
  userId: number
  canDownloadFederal: boolean
  completedTaskIds: string[]
  hasFreeTextsOffer: boolean
  firstName?: string
  lastName?: string
  image?: string
  claimed?: boolean
  positionName?: string
  raceId?: string
}

export interface VendorTsData {
  pathToVictory?: PathToVictoryData
  [key: string]: PathToVictoryData | string | number | boolean | object | undefined
}

export interface WebsiteIssue {
  title: string
  description: string
}

export interface WebsiteContent {
  hero?: {
    headline?: string
    subheadline?: string
  }
  about?: {
    title?: string
    content?: string
    bio?: string
    issues?: WebsiteIssue[]
    committee?: string
  }
  theme?: {
    color?: string
  }
  logo?: string
  createStep?: string
  main?: {
    title?: string
    tagline?: string
    image?: string
  }
  contact?: {
    address?: string
    email?: string
    phone?: string
  }
  vanityPath?: string
  status?: string
  heroFile?: File | null
  [key: string]: any
}

export interface Domain {
  name: string
  status: string
  verificationStatus?: string
}

export interface Website {
  id: number
  vanityPath: string
  status: string
  content: WebsiteContent | null
  domain?: Domain | null
  createdAt?: Date | string
  updatedAt?: Date | string
  campaignId?: number
}

export interface WebsiteContact {
  id: number
  email: string
  name?: string | null
  createdAt: Date | string
}