'use client'
import { useContext, useMemo } from 'react'
import { SearchFilters, SearchFiltersContext } from './SearchFiltersProvider'

interface FilterableItem {
  title?: string
  description?: string
  status?: string
}

type FilterItemsFunction = <T extends FilterableItem>(items: T[]) => T[]

type SearchFiltersReturn = [
  filters: SearchFilters,
  setFilters: (filters: SearchFilters) => void,
  filterItems: FilterItemsFunction,
]

export const useSearchFilters = (): SearchFiltersReturn => {
  const context = useContext(SearchFiltersContext)
  if (!context) {
    throw new Error(
      'useSearchFilters must be used within a SearchFiltersProvider',
    )
  }

  const [filters, setFilters] = context
  const typedFilters = filters

  const filterItems: FilterItemsFunction = useMemo(() => {
    return <T extends FilterableItem>(items: T[] = []): T[] => {
      return (
        items?.filter((item) => {
          const matchesSearch =
            !typedFilters.search ||
            typedFilters.search === '' ||
            item.title
              ?.toLowerCase()
              .includes(typedFilters.search.toLowerCase()) ||
            item.description
              ?.toLowerCase()
              .includes(typedFilters.search.toLowerCase())

          const statusString =
            typeof item.status === 'string'
              ? item.status
              : String(item.status || '')
          const matchesStatus =
            !typedFilters.status ||
            typedFilters.status === 'all' ||
            statusString === typedFilters.status

          return matchesSearch && matchesStatus
        }) || []
      )
    }
  }, [typedFilters])

  return [filters, setFilters, filterItems]
}
