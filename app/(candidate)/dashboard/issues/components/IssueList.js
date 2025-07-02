'use client'
import { useIssues } from '@shared/hooks/useIssues'
import { useSearchFilters } from '@shared/hooks/useSearchFilters'
import IssueSnippet from './IssueSnippet'

export default function IssueList() {
  const { issues: allIssues } = useIssues()
  const { issues: filteredIssues } = useSearchFilters(allIssues)

  return (
    <div className="flex flex-col gap-2 mt-4">
      {filteredIssues.map((issue) => (
        <IssueSnippet key={issue.id} issue={issue} />
      ))}
    </div>
  )
}
