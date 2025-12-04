'use client'
import { useContext, useMemo } from 'react'
import { SearchFiltersContext } from './SearchFiltersProvider'

interface FilterableItem {
  title?: string
  description?: string
  status?: string
}

interface FiltersWithSearchAndStatus {
  search?: string
  status?: string
}

export const useSearchFilters = () => {
  const context = useContext(SearchFiltersContext)
  if (!context) {
    throw new Error(
      'useSearchFilters must be used within a SearchFiltersProvider',
    )
  }

  const [filters, setFilters] = context
  const typedFilters = filters as FiltersWithSearchAndStatus

  const filterItems = useMemo(() => {
    return (items: FilterableItem[] = []) => {
      return (
        items?.filter((item) => {
          const matchesSearch =
            !typedFilters.search ||
            typedFilters.search === '' ||
            item.title?.toLowerCase().includes(typedFilters.search.toLowerCase()) ||
            item.description
              ?.toLowerCase()
              .includes(typedFilters.search.toLowerCase())

          const matchesStatus =
            !typedFilters.status ||
            typedFilters.status === 'all' ||
            item.status === typedFilters.status

          return matchesSearch && matchesStatus
        }) || []
      )
    }
  }, [typedFilters])

  return [filters, setFilters, filterItems]
}

