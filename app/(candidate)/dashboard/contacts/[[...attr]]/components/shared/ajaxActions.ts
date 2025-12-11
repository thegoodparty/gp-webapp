import { DEFAULT_PAGE_SIZE, ALL_SEGMENTS } from './constants'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface SegmentPayload {
  name?: string
  [key: string]: unknown
}

interface SegmentResponse {
  id: number
  name?: string
  [key: string]: unknown
}

interface FetchContactsParams {
  page?: number
  resultsPerPage?: number
  segment?: string
}

interface ListContactsResponse {
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
