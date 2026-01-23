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
}: FetchContactsParams = {}): Promise<ListContactsResponse | null> {
  const payload = {
    page: page || 1,
    resultsPerPage: resultsPerPage || DEFAULT_PAGE_SIZE,
    segment: segment || ALL_SEGMENTS,
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

interface SearchContactsParams {
  page?: number
  resultsPerPage?: number
  query?: string
  name?: string
  phone?: string
}

export async function searchContacts({
  page,
  resultsPerPage,
  query,
  name,
  phone,
}: SearchContactsParams = {}): Promise<ListContactsResponse | null> {
  const payload: Record<string, unknown> = {
    page: page || 1,
    resultsPerPage: resultsPerPage || DEFAULT_PAGE_SIZE,
  }

  if (phone) {
    payload.phone = phone
  } else if (name) {
    payload.name = name
  } else if (query) {
    const isNumeric = /^\d+$/.test(query.trim())
    if (isNumeric) {
      payload.phone = query.trim()
    } else {
      payload.name = query.trim()
    }
  }

  const response = await clientFetch<ListContactsResponse>(
    apiRoutes.contacts.search,
    payload,
  )
  if (response.ok) {
    return response.data || null
  } else {
    console.error('Failed to search contacts', response)
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
    console.error('Failed to fetch person', response)
    return null
  }
}
