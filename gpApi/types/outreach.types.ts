/** Outreach type values from the API / Prisma */
export type OutreachType =
  | 'text'
  | 'doorKnocking'
  | 'phoneBanking'
  | 'socialMedia'
  | 'robocall'
  | 'p2p'

/** Outreach status values from the API / Prisma */
export type OutreachStatus =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'paid'
  | 'in_progress'
  | 'completed'

/** Payload for POST /outreach (create) */
export interface CreateOutreachPayload {
  campaignId: number
  outreachType: OutreachType
  message?: string | null
  title?: string | null
  script?: string | null
  date?: string | null
  voterFileFilterId?: number
  audienceRequest?: string | null
  phoneListId?: number
}

/** VoterFileFilter as returned when included on Outreach (scalars only, from Prisma) */
export interface VoterFileFilterInOutreach {
  id: number
  createdAt: string
  updatedAt: string
  name: string | null
  audienceSuperVoters: boolean | null
  audienceLikelyVoters: boolean | null
  audienceUnreliableVoters: boolean | null
  audienceUnlikelyVoters: boolean | null
  audienceFirstTimeVoters: boolean | null
  audienceUnknown: boolean | null
  partyIndependent: boolean | null
  partyDemocrat: boolean | null
  partyRepublican: boolean | null
  partyUnknown: boolean | null
  age18_25: boolean | null
  age25_35: boolean | null
  age35_50: boolean | null
  age50Plus: boolean | null
  ageUnknown: boolean | null
  genderMale: boolean | null
  genderFemale: boolean | null
  genderUnknown: boolean | null
  hasCellPhone: boolean | null
  hasLandline: boolean | null
  languageCodes: string[]
  voterStatus: string[]
  likelyMarried: boolean | null
  likelySingle: boolean | null
  married: boolean | null
  single: boolean | null
  maritalUnknown: boolean | null
  veteranYes: boolean | null
  veteranUnknown: boolean | null
  educationNone: boolean | null
  educationHighSchoolDiploma: boolean | null
  educationTechnicalSchool: boolean | null
  educationSomeCollege: boolean | null
  educationCollegeDegree: boolean | null
  educationGraduateDegree: boolean | null
  educationUnknown: boolean | null
  incomeRanges: string[]
  incomeUnknown: boolean | null
  ethnicityAsian: boolean | null
  ethnicityEuropean: boolean | null
  ethnicityHispanic: boolean | null
  ethnicityAfricanAmerican: boolean | null
  ethnicityOther: boolean | null
  ethnicityUnknown: boolean | null
  businessOwnerYes: boolean | null
  businessOwnerUnknown: boolean | null
  registeredVoterTrue: boolean | null
  registeredVoterFalse: boolean | null
  registeredVoterUnknown: boolean | null
  hasChildrenYes: boolean | null
  hasChildrenNo: boolean | null
  hasChildrenUnknown: boolean | null
  homeownerYes: boolean | null
  homeownerLikely: boolean | null
  homeownerNo: boolean | null
  homeownerUnknown: boolean | null
  voterCount: number | null
  campaignId: number
}

/** Outreach returned from POST /outreach (Prisma create with include: { voterFileFilter: true }) */
export interface CreateOutreachResponse {
  id: number
  createdAt: string
  updatedAt: string
  campaignId: number
  outreachType: OutreachType
  projectId: string | null
  name: string | null
  status: OutreachStatus | null
  error: string | null
  audienceRequest: string | null
  script: string | null
  message: string | null
  date: string | null
  imageUrl: string | null
  voterFileFilterId: number | null
  phoneListId: number | null
  identityId: string | null
  didState: string | null
  didNpaSubset: string[] | null
  title: string | null
  voterFileFilter: VoterFileFilterInOutreach | null
}
