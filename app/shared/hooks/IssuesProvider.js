'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const IssuesContext = createContext({
  issues: [],
  setIssues: () => {},
  refreshIssues: () => {},
  filters: {},
  setFilters: () => {},
  totalIssueCount: 0,
  viewMode: 'list',
  setViewMode: () => {},
})

export function IssuesProvider({ children, issues: initialIssues }) {
  const [issues, setIssues] = useState(initialIssues)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  })
  const [viewMode, setViewMode] = useState('list')

  const refreshIssues = async () => {
    try {
      const resp = await clientFetch(apiRoutes.issues.list)
      setIssues(resp?.status === 404 || resp.ok === false ? [] : resp.data)
    } catch (e) {
      console.error('error fetching issues', e)
      setIssues([])
    }
  }

  const filteredIssues =
    issues?.filter((issue) => {
      // Search filter
      const matchesSearch =
        filters.search === '' ||
        issue.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.description?.toLowerCase().includes(filters.search.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.status === 'all' || issue.status === filters.status

      return matchesSearch && matchesStatus
    }) || []

  const totalIssueCount = issues?.length || 0

  const contextValue = {
    issues: filteredIssues,
    setIssues,
    refreshIssues,
    filters,
    setFilters,
    totalIssueCount,
    viewMode,
    setViewMode,
  }

  return (
    <IssuesContext.Provider value={contextValue}>
      {children}
    </IssuesContext.Provider>
  )
}
