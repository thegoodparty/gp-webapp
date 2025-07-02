'use client'
import React, { useState } from 'react'
import { useIssues } from '@shared/hooks/useIssues'
import { useSearchFilters } from '@shared/hooks/useSearchFilters'
import SearchInput from './SearchInput'
import StatusFilter from './StatusFilter'
import ViewModeToggle from './ViewModeToggle'
import Paper from '@shared/utils/Paper'

export default function SearchContainer() {
  const { issues: allIssues } = useIssues()
  const { filters, setFilters } = useSearchFilters(allIssues)
  const [viewMode, setViewMode] = useState('list')

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
        value={filters.search}
        onChange={handleSearchChange}
        totalCount={totalIssueCount}
      />
      <div className="flex justify-between mt-6">
        <StatusFilter value={filters.status} onChange={handleStatusChange} />

        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>
    </Paper>
  )
}
