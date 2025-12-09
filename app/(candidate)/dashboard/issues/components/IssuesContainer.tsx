'use client'
import { useViewMode } from '@shared/hooks/useViewMode'
import IssueList from './list/IssueList'
import IssueBoard from './board/IssueBoard'
import { VIEW_MODES } from '../shared/constants'
import EmptyIssues from './EmptyIssues'
import { useIssues } from '@shared/hooks/useIssues'

export default function IssuesContainer(): React.JSX.Element {
  const [viewMode] = useViewMode()
  const [issues] = useIssues()

  return (
    <>
      {issues?.length === 0 ? (
        <EmptyIssues />
      ) : (
        <>{viewMode === VIEW_MODES.LIST ? <IssueList /> : <IssueBoard />}</>
      )}
    </>
  )
}
