'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const IssuesContext = createContext([[], () => {}])

export function IssuesProvider({ children, issues: initialIssues }) {
  const [issues, setIssues] = useState(initialIssues)

  const refreshIssues = async () => {
    try {
      const resp = await clientFetch(apiRoutes.issues.list)
      setIssues(resp?.status === 404 || resp.ok === false ? [] : resp.data)
    } catch (e) {
      console.error('error fetching issues', e)
      setIssues([])
    }
  }

  return (
    <IssuesContext.Provider value={[issues, refreshIssues]}>
      {children}
    </IssuesContext.Provider>
  )
}
