'use client'
import React from 'react'
import { useIssues } from '@shared/hooks/useIssues'
import { useSearchFilters } from '@shared/hooks/useSearchFilters'
import { useViewMode } from '@shared/hooks/useViewMode'
import SearchInput from './SearchInput'
import StatusFilter from './StatusFilter'
import ViewModeToggle from './ViewModeToggle'
import Paper from '@shared/utils/Paper'

export default function SearchContainer() {
  const [allIssues] = useIssues()
  const [filters, setFilters] = useSearchFilters()
  const [viewMode, setViewMode] = useViewMode()

  const totalIssueCount = allIssues?.length || 0

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      search: e.target.value,
    })
  }

  const handleStatusChange = (e) => {
    setFilters({
      ...filters,
      status: e.target.value,
    })
  }

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode)
  }

  return (
    <Paper className="mt-6">
      <SearchInput
        fullWidth
        value={filters.search}
        placeholder={`Search ${totalIssueCount} issues`}
        onChange={handleSearchChange}
      />
      <div className="flex justify-between mt-6">
        <StatusFilter value={filters.status} onChange={handleStatusChange} />

        <ViewModeToggle value={viewMode} onChange={handleViewModeChange} />
      </div>
    </Paper>
  )
}
