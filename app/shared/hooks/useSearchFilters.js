'use client'
import { useContext, useMemo } from 'react'
import { SearchFiltersContext } from './SearchFiltersProvider'

export const useSearchFilters = (issues = []) => {
  const context = useContext(SearchFiltersContext)
  if (!context) {
    throw new Error(
      'useSearchFilters must be used within a SearchFiltersProvider',
    )
  }

  const [filters, setFilters] = context

  const filteredIssues = useMemo(() => {
    return (
      issues?.filter((issue) => {
        // Search filter
        const matchesSearch =
          filters.search === '' ||
          issue.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          issue.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())

        // Status filter
        const matchesStatus =
          filters.status === 'all' || issue.status === filters.status

        return matchesSearch && matchesStatus
      }) || []
    )
  }, [issues, filters])

  return {
    issues: filteredIssues,
    filters,
    setFilters,
  }
}
