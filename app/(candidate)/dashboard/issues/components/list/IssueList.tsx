'use client'
import { useState, useEffect } from 'react'
import { useIssues } from '@shared/hooks/useIssues'
import { useSearchFilters } from '@shared/hooks/useSearchFilters'
import IssueSnippet from './IssueSnippet'

export default function IssueList(): React.JSX.Element {
  const [allIssues] = useIssues()
  const [, , filterItemsFn] = useSearchFilters()
  const [filteredIssues, setFilteredIssues] = useState(allIssues)

  useEffect(() => {
    setFilteredIssues(filterItemsFn(allIssues))
  }, [allIssues, filterItemsFn])

  return (
    <div className="flex flex-col gap-2 mt-4">
      {filteredIssues.map((issue) => (
        <IssueSnippet key={issue.uuid} issue={issue} />
      ))}
    </div>
  )
}
