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
  order?: number
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
  primaryResult?: 'won' | 'lost' | null
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
  ballotOffice?: boolean | null
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

export type TcrComplianceStatus =
  | 'submitted'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'error'

export interface TcrCompliance {
  id: string
  ein: string
  postalAddress: string
  committeeName: string
  websiteDomain: string
  filingUrl: string
  phone: string
  email: string
  status?: TcrComplianceStatus | null
  tdlcNumber?: string | null
  createdAt: Date | string
  updatedAt: Date | string
  campaignId: number
  peerlyIdentityId?: string | null
  peerlyRegistrationLink?: string | null
  peerlyIdentityProfileLink?: string | null
  peerly10DLCBrandSubmissionKey?: string | null
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

// VoterFileFilters - Just the filter fields (for forms and partial data)
export interface VoterFileFilters {
  audienceSuperVoters?: boolean
  audienceLikelyVoters?: boolean
  audienceUnreliableVoters?: boolean
  audienceUnlikelyVoters?: boolean
  audienceFirstTimeVoters?: boolean
  audienceUnknown?: boolean
  partyIndependent?: boolean
  partyDemocrat?: boolean
  partyRepublican?: boolean
  partyUnknown?: boolean
  age18_25?: boolean
  age25_35?: boolean
  age35_50?: boolean
  age50Plus?: boolean
  ageUnknown?: boolean
  genderMale?: boolean
  genderFemale?: boolean
  genderUnknown?: boolean
  hasCellPhone?: boolean
  hasLandline?: boolean
  languageCodes?: string[]
  voterStatus?: string[]
  likelyMarried?: boolean
  likelySingle?: boolean
  married?: boolean
  single?: boolean
  maritalUnknown?: boolean
  veteranYes?: boolean
  veteranUnknown?: boolean
  educationNone?: boolean
  educationHighSchoolDiploma?: boolean
  educationTechnicalSchool?: boolean
  educationSomeCollege?: boolean
  educationCollegeDegree?: boolean
  educationGraduateDegree?: boolean
  educationUnknown?: boolean
  incomeRanges?: string[]
  incomeUnknown?: boolean
  ethnicityAsian?: boolean
  ethnicityEuropean?: boolean
  ethnicityHispanic?: boolean
  ethnicityAfricanAmerican?: boolean
  ethnicityOther?: boolean
  ethnicityUnknown?: boolean
  businessOwnerYes?: boolean
  businessOwnerUnknown?: boolean
  registeredVoterTrue?: boolean
  registeredVoterFalse?: boolean
  registeredVoterUnknown?: boolean
  hasChildrenYes?: boolean
  hasChildrenNo?: boolean
  hasChildrenUnknown?: boolean
  homeownerYes?: boolean
  homeownerLikely?: boolean
  homeownerNo?: boolean
  homeownerUnknown?: boolean
  voterCount?: number
}

// VoterFileFilter - Full Prisma model (for API responses with DB fields)
export interface VoterFileFilter extends VoterFileFilters {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  name?: string | null
  campaignId: number | string
}

export interface CustomVoterFile {
  id?: string
  name?: string
  url?: string
  channel?: string
  purpose?: string
  filters?: string[]
}

export interface AiContentData {
  name: string
  content: string
  updatedAt: number
  inputValues?: Partial<Record<string, string>>
}

export interface CampaignAiContent {
  generationStatus?: Partial<Record<string, { status?: string }>>
  campaignPlanAttempts?: Partial<Record<string, number>>
  [key: string]:
    | AiContentData
    | Partial<Record<string, string>>
    | Partial<Record<string, number>>
    | Partial<Record<string, { status?: string }>>
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

export interface IssuePosition {
  id: number
  name: string
}

export interface TopIssue {
  id?: number
  name?: string
  positions?: IssuePosition[]
}

export interface CandidatePosition {
  id: number
  topIssueId: number
  positionId: number
  description: string
  order: number
  topIssue?: TopIssue
  position?: IssuePosition
}

export interface ClaimedCampaign {
  website?: {
    vanityPath?: string
    domain?: Domain | null
  }
  details?: CampaignDetails
  campaignPositions?: CandidatePosition[]
}

export interface CampaignGoals {
  electionDate?: string
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
  claimed?: boolean | ClaimedCampaign
  positionName?: string
  raceId?: string
  // Map-related fields (flattened from API)
  party?: string
  office?: string
  city?: string
  county?: string
  state?: string
  avatar?: string
  electionDate?: string
  name?: string
  normalizedOffice?: string
  ballotLevel?: string
  globalPosition?: {
    lat: number
    lng: number
  }
  email?: string
  urls?: string[]
  Stances?: CandidateStance[]
  goals?: CampaignGoals
}

export interface CandidateStance {
  Issue?: { name?: string }
  stanceStatement?: string
}

export interface VendorTsData {
  pathToVictory?: PathToVictoryData
  [key: string]:
    | PathToVictoryData
    | string
    | number
    | boolean
    | object
    | undefined
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
  theme?: string
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
  phone?: string | null
  message?: string | null
  createdAt: Date | string
}

// ===== CMS Content Types =====

export interface PledgeContent {
  title?: string
  body?: string
}

// ===== Blog/Article Types =====

export interface ImageData {
  url?: string
  alt?: string
}

export interface Article {
  id?: string
  title: string
  slug: string
  summary?: string
  mainImage?: ImageData
  publishDate: string
  contentId?: string
}

// ===== AI Content Generation Types =====

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface GenerateAIContentResponse {
  success: boolean
  chat?: ChatMessage[]
  newChat?: ChatMessage[]
  content?: string
  error?: string
  status?: string
}

export interface Version {
  id?: string
  date?: string
  text?: string
  inputValues?: Partial<Record<string, string>>
}

export type CampaignVersions = Partial<Record<string, Version[]>>

// ===== Content Section Types =====

export type ContentSectionKey =
  | 'aiContent'
  | 'slogan'
  | 'campaignPlan'
  | 'policyPlatform'
  | 'candidateBio'
  | 'pressRelease'
  | 'socialMedia'
  | 'emailTemplate'
  | 'speechDraft'
  | 'doorKnockScript'
  | 'phoneScript'
  | 'textScript'

export interface ContentSection {
  key: ContentSectionKey | string
  title: string
  icon?: string
  type?: string
  slug?: string
  description?: string
  prompt?: string
}

// ===== Form Field Types =====

export interface PromptInputField {
  key: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'number'
  placeholder?: string
  required?: boolean
  maxLength?: number
  rows?: number
  cols?: number
  options?: string[] | RadioOption[]
  defaultValue?: string
  helperText?: string
  disabled?: boolean
}

export interface RadioOption {
  key: string
  label: string
  value?: string
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ===== Outreach Types =====

export type OutreachType = 'text' | 'email' | 'call' | 'directMail'

export interface Outreach {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  name: string
  type: OutreachType
  campaignId: number
  voterFileFilterId?: number | null
  content?: string | null
  subject?: string | null
  status?: string | null
  scheduledAt?: Date | string | null
  sentAt?: Date | string | null
  voterCount?: number | null
}

// ===== State Abbreviation Type =====

export type StateAbbreviation =
  | 'AL'
  | 'AK'
  | 'AZ'
  | 'AR'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DE'
  | 'DC'
  | 'FL'
  | 'GA'
  | 'HI'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IA'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'ME'
  | 'MD'
  | 'MA'
  | 'MI'
  | 'MN'
  | 'MS'
  | 'MO'
  | 'MT'
  | 'NE'
  | 'NV'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NY'
  | 'NC'
  | 'ND'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VT'
  | 'VA'
  | 'WA'
  | 'WV'
  | 'WI'
  | 'WY'

// ===== Rich Editor Types =====

export interface RichEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  placeholder?: string
  readOnly?: boolean
  minHeight?: string
}

// ===== Copy To Clipboard Types =====

export interface CopyToClipboardProps {
  text: string
  children?: React.ReactNode
  onCopy?: () => void
  onClick?: () => void
}

// ===== Purchase Types =====

export type PurchaseType = 'pro' | 'texting' | 'domain' | 'voterData'

export interface DomainRegistrationMetadata {
  domainName?: string
  price?: number
  years?: number
}

// ===== Ecanvasser Types =====

export interface Ecanvasser {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
  apiKey: string
  campaignId: number
  lastSync?: Date | string | null
  error?: string | null
}
