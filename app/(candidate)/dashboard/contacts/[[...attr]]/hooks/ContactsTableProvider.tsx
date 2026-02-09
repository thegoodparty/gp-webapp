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
import {
  useQuery,
  useInfiniteQuery,
  queryOptions,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchContacts,
  FetchContactsParams,
  fetchCustomSegments,
  fetchPerson,
  fetchConstituentIssues,
  fetchConstituentActivities,
  Person,
  type ConstituentIssue,
  type ConstituentActivity,
  type ListContactsResponse,
  type SegmentResponse,
} from '../components/shared/ajaxActions'
import { DEFAULT_PAGE_SIZE, ALL_SEGMENTS } from '../components/shared/constants'
import defaultSegments from '../components/configs/defaultSegments.config'
import { isCustomSegment } from '../components/shared/segments.util'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'

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

export interface CurrentlySelectedPerson {
  person: Person | null
  isLoadingPerson: boolean
  isErrorPerson: boolean
  issues: ConstituentIssue[]
  isLoadingIssues: boolean
  isErrorIssues: boolean
  issuesHasNextPage: boolean
  issuesFetchNextPage: () => void
  isFetchingNextIssues: boolean
  activities: ConstituentActivity[]
  isLoadingActivities: boolean
  isErrorActivities: boolean
  activitiesHasNextPage: boolean
  activitiesFetchNextPage: () => void
  isFetchingNextActivities: boolean
}

interface ContactsTableState {
  filteredContacts: Person[]
  currentlySelectedPersonId: string | null
  currentlySelectedPerson: CurrentlySelectedPerson
  segments: typeof defaultSegments
  customSegments: SegmentResponse[]
  currentSegment: string
  searchTerm: string
  urlQueryParams: URLSearchParams
  pagination: ListContactsResponse['pagination'] | null
  isLoading: boolean
  isCustomSegment: boolean
  totalSegmentContacts: number
  canUseProFeatures: boolean
  isElectedOfficial: boolean
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

const contactTableQueryOptions = (params: FetchContactsParams) =>
  queryOptions({
    queryKey: ['contacts', params],
    queryFn: async () => {
      const emptyResponse = {
        people: [],
        pagination: createEmptyPagination(params.page, params.resultsPerPage),
      }
      const data = await fetchContacts(params)
      return data || emptyResponse
    },
    refetchOnMount: false,
  })

export const ContactsTableProvider = ({
  children,
}: ContactsTableProviderProps) => {
  const router = useRouter()

  const [campaign] = useCampaign()
  const { electedOffice } = useElectedOffice()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()

  const segments = defaultSegments

  const canUseProFeatures = useMemo(() => {
    return !!campaign?.isPro || !!electedOffice
  }, [campaign, electedOffice])
  const isElectedOfficial = useMemo(() => {
    return !!electedOffice
  }, [electedOffice])

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

  const contactsQuery = useQuery(
    contactTableQueryOptions({
      page: currentPage,
      resultsPerPage: pageSize,
      segment: currentSegment,
      search: searchTerm,
    }),
  )

  // Prefetch the next page
  useQuery(
    contactTableQueryOptions({
      page: currentPage + 1,
      resultsPerPage: pageSize,
      segment: currentSegment,
      search: searchTerm,
    }),
  )

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

  const issuesInfiniteQuery = useInfiniteQuery({
    queryKey: ['contact-engagement', 'issues', currentlySelectedPersonId],
    queryFn: async ({ pageParam }) => {
      const id = currentlySelectedPersonId
      if (!id) return { nextCursor: null, results: [] }
      const data = await fetchConstituentIssues(id, {
        take: 3,
        after: pageParam as string | undefined,
      })
      return data ?? { nextCursor: null, results: [] }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: Boolean(currentlySelectedPersonId),
  })

  const activitiesInfiniteQuery = useInfiniteQuery({
    queryKey: ['contact-engagement', 'activities', currentlySelectedPersonId],
    queryFn: async ({ pageParam }) => {
      const id = currentlySelectedPersonId
      if (!id) return { nextCursor: null, results: [] }
      const data = await fetchConstituentActivities(id, {
        take: 2,
        after: pageParam as string | undefined,
      })
      return data ?? { nextCursor: null, results: [] }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
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

  const issuesFlattened = useMemo(
    () =>
      issuesInfiniteQuery.data?.pages.flatMap((p) => p.results) ?? [],
    [issuesInfiniteQuery.data?.pages],
  )

  const activitiesFlattened = useMemo(
    () =>
      activitiesInfiniteQuery.data?.pages.flatMap((p) => p.results) ?? [],
    [activitiesInfiniteQuery.data?.pages],
  )

  const currentlySelectedPerson = useMemo<CurrentlySelectedPerson>(
    () => ({
      person: personQuery.data ?? null,
      isLoadingPerson: personQuery.isLoading || personQuery.isFetching,
      isErrorPerson: personQuery.isError ?? false,
      issues: issuesFlattened,
      isLoadingIssues:
        issuesInfiniteQuery.isLoading ||
        (issuesInfiniteQuery.isFetching && issuesFlattened.length === 0),
      isErrorIssues: issuesInfiniteQuery.isError ?? false,
      issuesHasNextPage: issuesInfiniteQuery.hasNextPage ?? false,
      issuesFetchNextPage: issuesInfiniteQuery.fetchNextPage,
      isFetchingNextIssues: issuesInfiniteQuery.isFetchingNextPage ?? false,
      activities: activitiesFlattened,
      isLoadingActivities:
        activitiesInfiniteQuery.isLoading ||
        (activitiesInfiniteQuery.isFetching &&
          activitiesFlattened.length === 0),
      isErrorActivities: activitiesInfiniteQuery.isError ?? false,
      activitiesHasNextPage: activitiesInfiniteQuery.hasNextPage ?? false,
      activitiesFetchNextPage: activitiesInfiniteQuery.fetchNextPage,
      isFetchingNextActivities:
        activitiesInfiniteQuery.isFetchingNextPage ?? false,
    }),
    [
      personQuery.data,
      personQuery.isLoading,
      personQuery.isFetching,
      personQuery.isError,
      issuesFlattened,
      issuesInfiniteQuery.isLoading,
      issuesInfiniteQuery.isFetching,
      issuesInfiniteQuery.isError,
      issuesInfiniteQuery.hasNextPage,
      issuesInfiniteQuery.fetchNextPage,
      issuesInfiniteQuery.isFetchingNextPage,
      activitiesFlattened,
      activitiesInfiniteQuery.isLoading,
      activitiesInfiniteQuery.isFetching,
      activitiesInfiniteQuery.isError,
      activitiesInfiniteQuery.hasNextPage,
      activitiesInfiniteQuery.fetchNextPage,
      activitiesInfiniteQuery.isFetchingNextPage,
    ],
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
    isCustomSegment: isCustomSegmentValue,
    totalSegmentContacts,
    canUseProFeatures,
    isElectedOfficial,
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
