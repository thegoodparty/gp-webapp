'use client'

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
} from 'react'
import {
  useRouter,
  useSearchParams,
  usePathname,
  useParams,
} from 'next/navigation'
import { useQuery, queryOptions, useQueryClient } from '@tanstack/react-query'
import {
  fetchContacts,
  fetchCustomSegments,
  fetchPerson,
  type ListContactsResponse,
  type SegmentResponse,
} from '../components/shared/ajaxActions'
import { DEFAULT_PAGE_SIZE, ALL_SEGMENTS } from '../components/shared/constants'
import defaultSegments from '../components/configs/defaultSegments.config'
import { isCustomSegment } from '../components/shared/segments.util'

interface Person {
  id: number
  [key: string]: unknown
}

const createEmptyPagination = (
  currentPage: number,
  pageSize: number,
): ListContactsResponse['pagination'] => ({
  totalResults: 0,
  currentPage,
  pageSize,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})

const extractPersonIdFromParams = (
  params: ReturnType<typeof useParams> | null,
): string | null => {
  if (!params?.attr) return null

  const attrArray = Array.isArray(params.attr) ? params.attr : [params.attr]
  if (attrArray.length !== 1) return null

  const personId = attrArray[0]
  if (personId && typeof personId === 'string' && personId.trim().length > 0) {
    return personId
  }

  return null
}

interface ContactsTableState {
  filteredContacts: Person[]
  currentlySelectedPersonId: string | null
  currentlySelectedPerson: Person | null
  segments: typeof defaultSegments
  customSegments: SegmentResponse[]
  currentSegment: string
  searchTerm: string
  urlQueryParams: URLSearchParams
  pagination: ListContactsResponse['pagination'] | null
  isLoading: boolean
  isLoadingPerson: boolean
  isErrorPerson: boolean
  isCustomSegment: boolean
  totalSegmentContacts: number
}

interface ContactsTableActions {
  pageUp: () => void
  pageDown: () => void
  goToPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  selectPerson: (personId: string | number | null) => void
  selectSegment: (segment: string) => void
  searchContacts: (query: string) => void
  refreshCustomSegments: () => Promise<void>
}

type ContactsTableContextValue = ContactsTableState & ContactsTableActions

const ContactsTableContext = createContext<ContactsTableContextValue | null>(
  null,
)

export const useContactsTable = (): ContactsTableContextValue => {
  const context = useContext(ContactsTableContext)
  if (!context) {
    throw new Error(
      'useContactsTable must be used within ContactsTableProvider',
    )
  }
  return context
}

interface ContactsTableProviderProps {
  children: ReactNode
}

export const ContactsTableProvider = ({
  children,
}: ContactsTableProviderProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()

  const segments = defaultSegments

  const urlQueryParams = useMemo(() => {
    return new URLSearchParams(searchParams?.toString() || '')
  }, [searchParams])

  const currentSegment = useMemo(() => {
    return searchParams?.get('segment') || ALL_SEGMENTS
  }, [searchParams])

  const searchTerm = useMemo(() => {
    return searchParams?.get('query') || ''
  }, [searchParams])

  const currentPage = useMemo(() => {
    return parseInt(searchParams?.get('page') || '1', 10)
  }, [searchParams])

  const pageSize = useMemo(() => {
    return parseInt(
      searchParams?.get('pageSize') || String(DEFAULT_PAGE_SIZE),
      10,
    )
  }, [searchParams])

  const currentlySelectedPersonId = useMemo(
    () => extractPersonIdFromParams(params),
    [params],
  )

  const contactsQuery = useQuery({
    queryKey: [
      'contacts',
      {
        page: currentPage,
        pageSize,
        segment: currentSegment,
        query: searchTerm,
      },
    ],
    queryFn: async () => {
      const emptyResponse = {
        people: [],
        pagination: createEmptyPagination(currentPage, pageSize),
      }
      const data = await fetchContacts({
        page: currentPage,
        resultsPerPage: pageSize,
        segment: currentSegment,
        search: searchTerm,
      })
      return data || emptyResponse
    },
    refetchOnMount: false,
  })

  const personQuery = useQuery({
    queryKey: ['person', currentlySelectedPersonId],
    queryFn: async () => {
      const id = currentlySelectedPersonId
      if (!id) return null
      const person = await fetchPerson(id)
      return person as Person | null
    },
    enabled: Boolean(currentlySelectedPersonId),
  })

  const customSegmentsQueryOptions = queryOptions({
    queryKey: ['custom-segments'],
    queryFn: async () => {
      const segments = await fetchCustomSegments()
      return segments || []
    },
    initialData: undefined,
  })

  const customSegmentsQuery = useQuery(customSegmentsQueryOptions)

  const filteredContacts = useMemo(
    () => (contactsQuery.data?.people as Person[]) || [],
    [contactsQuery.data],
  )

  const pagination = useMemo(
    () => contactsQuery.data?.pagination || null,
    [contactsQuery.data],
  )

  const currentlySelectedPerson = useMemo(
    () => personQuery.data || null,
    [personQuery.data],
  )

  const customSegments = useMemo(
    () => customSegmentsQuery.data || [],
    [customSegmentsQuery.data],
  )

  const isCustomSegmentValue = useMemo(() => {
    return isCustomSegment(customSegments, currentSegment)
  }, [customSegments, currentSegment])

  const totalSegmentContacts = useMemo(() => {
    return pagination?.totalResults || 0
  }, [pagination])

  const isLoading = contactsQuery.isLoading || contactsQuery.isFetching
  const isLoadingPerson = personQuery.isLoading || personQuery.isFetching
  const isErrorPerson = personQuery.isError || false

  const updateURL = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams?.toString() || '')

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      const newUrl = `${pathname}${
        params.toString() ? `?${params.toString()}` : ''
      }`
      router.push(newUrl, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const queryClient = useQueryClient()

  const refreshCustomSegments = useCallback(async () => {
    await customSegmentsQuery.refetch()
    queryClient.invalidateQueries({ queryKey: ['contacts'] })
  }, [customSegmentsQuery, queryClient])

  const pageUp = useCallback(() => {
    if (pagination?.hasNextPage) {
      updateURL({ page: currentPage + 1 })
    }
  }, [pagination, currentPage, updateURL])

  const pageDown = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      updateURL({ page: currentPage - 1 })
    }
  }, [pagination, currentPage, updateURL])

  const goToPage = useCallback(
    (page: number) => {
      const totalPages = pagination?.totalPages || 1
      const targetPage = Math.max(1, Math.min(page, totalPages))
      updateURL({ page: targetPage })
    },
    [pagination, updateURL],
  )

  const setPageSize = useCallback(
    (newPageSize: number) => {
      updateURL({ pageSize: newPageSize, page: 1 })
    },
    [updateURL],
  )

  const selectPerson = useCallback(
    (personId: string | number | null) => {
      const basePath = '/dashboard/contacts'
      const currentParams = new URLSearchParams(searchParams?.toString() || '')
      const queryString = currentParams.toString()
        ? `?${currentParams.toString()}`
        : ''

      const path =
        personId === null ? basePath : `${basePath}/${String(personId)}`

      router.push(`${path}${queryString}`, { scroll: false })
    },
    [router, searchParams],
  )

  const selectSegment = useCallback(
    (segment: string) => {
      updateURL({ segment, page: 1 })
    },
    [updateURL],
  )

  const searchContactsAction = useCallback(
    (query: string) => {
      if (query.trim()) {
        updateURL({ query: query, page: 1 })
      } else {
        updateURL({ query: null })
      }
    },
    [updateURL],
  )

  const value: ContactsTableContextValue = {
    filteredContacts,
    currentlySelectedPersonId,
    currentlySelectedPerson,
    segments,
    customSegments,
    currentSegment,
    searchTerm,
    urlQueryParams,
    pagination,
    isLoading,
    isLoadingPerson,
    isErrorPerson,
    isCustomSegment: isCustomSegmentValue,
    totalSegmentContacts,
    pageUp,
    pageDown,
    goToPage,
    setPageSize,
    selectPerson,
    selectSegment,
    searchContacts: searchContactsAction,
    refreshCustomSegments,
  }

  return (
    <ContactsTableContext.Provider value={value}>
      {children}
    </ContactsTableContext.Provider>
  )
}
