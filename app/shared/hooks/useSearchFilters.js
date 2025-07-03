'use client'
import { useContext, useMemo } from 'react'
import { SearchFiltersContext } from './SearchFiltersProvider'

export const useSearchFilters = () => {
  const context = useContext(SearchFiltersContext)
  if (!context) {
    throw new Error(
      'useSearchFilters must be used within a SearchFiltersProvider',
    )
  }

  const [filters, setFilters] = context

  const filterItems = useMemo(() => {
    return (items = []) => {
      return (
        items?.filter((item) => {
          const matchesSearch =
            filters.search === '' ||
            item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.description
              ?.toLowerCase()
              .includes(filters.search.toLowerCase())

          const matchesStatus =
            filters.status === 'all' || item.status === filters.status

          return matchesSearch && matchesStatus
        }) || []
      )
    }
  }, [filters])

  return [filters, setFilters, filterItems]
}
