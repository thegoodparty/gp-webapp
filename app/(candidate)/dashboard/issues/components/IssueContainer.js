'use client'
import { useIssues } from '@shared/hooks/useIssues'
import IssueList from './IssueList'

export default function IssueContainer() {
  const { viewMode } = useIssues()

  return <>{viewMode === 'list' ? <IssueList /> : <div>Board</div>}</>
}
