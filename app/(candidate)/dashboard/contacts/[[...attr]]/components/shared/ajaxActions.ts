import { DEFAULT_PAGE_SIZE, ALL_SEGMENTS } from './constants'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface SegmentPayload {
  name?: string
  [key: string]: unknown
}

export interface SegmentResponse {
  id: number
  name?: string
  [key: string]: unknown
}

interface FetchContactsParams {
  page?: number
  resultsPerPage?: number
  segment?: string
  search?: string
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

export async function saveCustomSegment(
  payload: SegmentPayload,
): Promise<SegmentResponse | false> {
  const response = await clientFetch<SegmentResponse>(
    apiRoutes.voterFileFilter.create,
    payload,
  )
  if (response.ok) {
    return response.data
  } else {
    console.error('Failed to create segment', response)
    return false
  }
}

export async function updateCustomSegment(
  id: number,
  payload: SegmentPayload,
): Promise<SegmentResponse | false> {
  const response = await clientFetch<SegmentResponse>(
    apiRoutes.voterFileFilter.update,
    {
      id,
      ...payload,
    },
  )
  if (response.ok) {
    return response.data
  } else {
    console.error('Failed to update segment', response)
    return false
  }
}

export async function fetchCustomSegments(): Promise<SegmentResponse[]> {
  const response = await clientFetch<SegmentResponse[]>(
    apiRoutes.voterFileFilter.list,
  )
  return response.data || []
}

export async function deleteCustomSegment(id: number) {
  return await clientFetch(apiRoutes.voterFileFilter.delete, { id })
}

export async function fetchContactsCsv(segment?: string) {
  return await clientFetch(
    apiRoutes.contacts.download,
    { segment },
    {
      returnFullResponse: true,
    },
  )
}

export async function fetchContacts({
  page,
  resultsPerPage,
  segment,
  search,
}: FetchContactsParams): Promise<ListContactsResponse | null> {
  const payload: Record<string, unknown> = {
    page: page || 1,
    resultsPerPage: resultsPerPage || DEFAULT_PAGE_SIZE,
    segment: segment || ALL_SEGMENTS,
  }
  if (search) {
    payload.search = search
  }
  const response = await clientFetch<ListContactsResponse>(
    apiRoutes.contacts.list,
    payload,
  )
  if (response.ok) {
    return response.data || null
  } else {
    console.error('Failed to fetch contacts', response)
    return null
  }
}

export async function fetchPerson(
  personId: string | number,
): Promise<Record<string, unknown> | null> {
  const response = await clientFetch<Record<string, unknown>>(
    apiRoutes.contacts.get,
    { id: personId },
  )
  if (response.ok) {
    return response.data || null
  } else {
    console.error('Failed to fetch person')
    console.error(response)
    return null
  }
}
