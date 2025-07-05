'use client'
import { useViewMode } from '@shared/hooks/useViewMode'
import IssueList from './list/IssueList'
import IssueBoard from './board/IssueBoard'

export default function IssueContainer() {
  const [viewMode] = useViewMode()

  return <>{viewMode === 'list' ? <IssueList /> : <IssueBoard />}</>
}
