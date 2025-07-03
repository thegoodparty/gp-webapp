'use client'
import { useIssues } from '@shared/hooks/useIssues'
import IssueSnippet from './IssueSnippet'

export default function IssueList() {
  const [issues] = useIssues()

  return (
    <div className="flex flex-col gap-4">
      {issues.map((issue) => (
        <IssueSnippet key={issue.id} issue={issue} />
      ))}
    </div>
  )
}
