'use client'
import { useState, useEffect } from 'react'
import { useIssues } from '@shared/hooks/useIssues'
import { useSearchFilters } from '@shared/hooks/useSearchFilters'
import IssueSnippet from './IssueSnippet'

export default function IssueList() {
  const [allIssues] = useIssues()
  const [filters, setFilters, filterItems] = useSearchFilters()
  const [filteredIssues, setFilteredIssues] = useState(allIssues)

  useEffect(() => {
    setFilteredIssues(filterItems(allIssues))
  }, [allIssues, filterItems])

  return (
    <div className="flex flex-col gap-2 mt-4">
      {filteredIssues.map((issue) => (
        <IssueSnippet key={issue.id} issue={issue} />
      ))}
    </div>
  )
}
