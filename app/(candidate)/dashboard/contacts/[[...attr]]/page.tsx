import pageMetaData from 'helpers/metadataHelper'
import { ContactsProvider } from './hooks/ContactsProvider'
import ContactsPage from './components/ContactsPage'
import { PersonProvider } from './hooks/PersonProvider'
import { CustomSegmentsProvider } from './hooks/CustomSegmentsProvider'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { DEFAULT_PAGE_SIZE } from './components/shared/constants'
import candidateAccess from '../../shared/candidateAccess'
import type { SearchParams } from 'next/dist/server/request/search-params'
import type { ComponentProps } from 'react'
import type {
  ListContactsResponse,
  SegmentResponse,
} from './components/shared/ajaxActions'

interface FetchFilteredContactsParams {
  page?: number
  resultsPerPage?: number
  segment?: string | string[]
}

interface FetchSearchedContactsParams {
  page?: number
  resultsPerPage?: number
  query?: string | string[]
}

interface SearchContactsPayload {
  page: number
  resultsPerPage: number
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
}

type PersonData = ComponentProps<typeof PersonProvider>['person']

const fetchFilteredContacts = async ({
  page = 1,
  resultsPerPage = DEFAULT_PAGE_SIZE,
  segment = 'all',
}: FetchFilteredContactsParams): Promise<ListContactsResponse> => {
  const payload = {
    page,
    resultsPerPage,
    segment,
  }
  const response = await serverFetch<ListContactsResponse>(
    apiRoutes.contacts.list,
    payload,
  )
  if (response.ok) {
    return response.data
  } else {
    console.warn('Failed to fetch contacts', response)
    return {
      people: [],
      pagination: {
        currentPage: page,
        pageSize: resultsPerPage,
        totalPages: 0,
        totalResults: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}
const fetchSearchedContacts = async ({
  page = 1,
  resultsPerPage = DEFAULT_PAGE_SIZE,
  query = '',
}: FetchSearchedContactsParams): Promise<ListContactsResponse> => {
  const payload: SearchContactsPayload &
    Partial<Record<string, string | number>> = {
    page,
    resultsPerPage,
  }

  const queryValue = Array.isArray(query) ? query.join(',') : query
  const isNumeric = /^\d+$/.test(queryValue.trim())
  if (isNumeric) {
    payload.phone = queryValue.trim()
  } else {
    payload.name = queryValue.trim()
  }

  const response = await serverFetch<ListContactsResponse>(
    apiRoutes.contacts.search,
    payload,
    {
      revalidate: 3600,
    },
  )
  if (response.ok) {
    return response.data
  } else {
    console.warn('Failed to search contacts', response)
    return {
      people: [],
      pagination: {
        currentPage: page,
        pageSize: resultsPerPage,
        totalPages: 0,
        totalResults: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}

const fetchPerson = async (personId: string): Promise<PersonData> => {
  const response = await serverFetch<PersonData>(
    apiRoutes.contacts.get,
    { id: personId },
    {
      revalidate: 3600,
    },
  )
  if (response.ok) {
    return response.data
  } else {
    console.warn('Failed to fetch person', response)
    return null
  }
}

const fetchCustomSegments = async (): Promise<SegmentResponse[]> => {
  const response = await serverFetch<SegmentResponse[]>(
    apiRoutes.voterFileFilter.list,
  )
  if (response.ok) {
    return response.data || []
  } else {
    console.warn('Failed to fetch custom segments', response)
    return []
  }
}

const meta = pageMetaData({
  title: 'Contacts  | GoodParty.org',
  description: 'Manage your campaign contacts.',
  slug: '/dashboard/contacts',
})
export const metadata = meta
export const dynamic = 'force-dynamic'

interface Params {
  attr?: string[]
}

interface PageProps {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}

const Page = async ({
  params,
  searchParams,
}: PageProps): Promise<React.JSX.Element> => {
  await candidateAccess()
  const { page, pageSize, segment, query } = await searchParams
  const { attr } = await params
  const segmentValue = Array.isArray(segment) ? segment.join(',') : segment
  const queryValue = Array.isArray(query) ? query.join(',') : query
  let personId = null
  let person = null

  if (attr && attr.length === 1) {
    personId = attr[0]!
    person = await fetchPerson(personId)
  }

  const resolvedPage = parseInt(
    Array.isArray(page) ? page.join(',') : page || '1',
  )
  const resolvedPageSize = parseInt(
    Array.isArray(pageSize)
      ? pageSize.join(',')
      : pageSize || String(DEFAULT_PAGE_SIZE),
  )

  const [contacts, initCustomSegments] = await Promise.all([
    queryValue
      ? fetchSearchedContacts({
          page: resolvedPage,
          resultsPerPage: resolvedPageSize,
          query: queryValue,
        })
      : fetchFilteredContacts({
          page: resolvedPage,
          resultsPerPage: resolvedPageSize,
          segment: segmentValue || 'all',
        }),
    fetchCustomSegments(),
  ])

  return (
    <ContactsProvider contacts={contacts}>
      <PersonProvider person={person}>
        <CustomSegmentsProvider
          customSegments={initCustomSegments}
          querySegment={segmentValue}
        >
          <ContactsPage />
        </CustomSegmentsProvider>
      </PersonProvider>
    </ContactsProvider>
  )
}

export default Page
