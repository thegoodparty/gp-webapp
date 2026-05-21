export interface SegmentResponse {
  id: number
  name?: string
  [key: string]: unknown
}

export type Person = {
  id: string
  lalVoterId: string
  firstName: string | null
  middleName: string | null
  lastName: string | null
  nameSuffix: string | null
  age: number | null
  state: string
  address: {
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    zip: string | null
    zipPlus4: string | null
    latitude: string | null
    longitude: string | null
  }
  cellPhone: string | null
  landline: string | null
  gender: 'Male' | 'Female' | null
  politicalParty: 'Independent' | 'Democratic' | 'Republican' | 'Other'
  registeredVoter: 'Yes' | 'No'
  estimatedIncomeAmount: number | null
  voterStatus:
    | 'Super'
    | 'Likely'
    | 'Unreliable'
    | 'Unlikely'
    | 'First Time'
    | null
  maritalStatus:
    | 'Likely Married'
    | 'Likely Single'
    | 'Married'
    | 'Single'
    | null
  hasChildrenUnder18: 'Yes' | 'No' | null
  veteranStatus: 'Yes' | null
  homeowner: 'Yes' | 'Likely' | 'No' | null
  businessOwner: 'Yes' | null
  levelOfEducation:
    | 'None'
    | 'High School Diploma'
    | 'Technical School'
    | 'Some College'
    | 'College Degree'
    | 'Graduate Degree'
    | null
  ethnicityGroup:
    | 'Asian'
    | 'European'
    | 'Hispanic'
    | 'African American'
    | 'Other'
    | null
  language: 'English' | 'Spanish' | 'Other'
}

export interface ListContactsResponse {
  pagination: {
    totalResults: number
    currentPage: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  people: unknown[]
}

export type ConstituentIssue = {
  issueTitle: string
  issueSummary: string
  pollTitle: string
  pollId: string
  date: string
}

export type GetConstituentIssuesResponse = {
  nextCursor: string | null
  results: ConstituentIssue[]
}

export type ConstituentActivityEventType = 'SENT' | 'RESPONDED' | 'OPTED_OUT'

export type ConstituentActivityEvent = {
  type: ConstituentActivityEventType
  date: string
}

export type ConstituentActivity = {
  type: string
  date: string
  data: {
    pollId: string
    pollTitle: string
    events: ConstituentActivityEvent[]
  }
}

export type GetIndividualActivitiesResponse = {
  nextCursor: string | null
  results: ConstituentActivity[]
}
