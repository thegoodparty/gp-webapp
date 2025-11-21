'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

type IssuesContextValue = [
  issues: never[],
  setIssues: (issues: never[]) => void,
  refreshIssues: () => Promise<void>
]

export const IssuesContext = createContext<IssuesContextValue>([[], () => {}, async () => {}])

interface IssuesProviderProps {
  children: React.ReactNode
  issues: never[]
}

export const IssuesProvider = ({ children, issues: initialIssues }: IssuesProviderProps): React.JSX.Element => {
  const [issues, setIssues] = useState<never[]>(initialIssues)

  const refreshIssues = async () => {
    try {
      const resp = await clientFetch(apiRoutes.issues.list)
      setIssues(resp?.status === 404 || resp.ok === false ? [] : (resp.data as never[]))
    } catch (e) {
      console.error('error fetching issues', e)
      setIssues([])
    }
  }

  const contextValue: IssuesContextValue = [issues, setIssues, refreshIssues]

  return (
    <IssuesContext.Provider value={contextValue}>
      {children}
    </IssuesContext.Provider>
  )
}

