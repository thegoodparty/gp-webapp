'use client'

import { createContext, useContext } from 'react'
import { PollIssue } from '../poll-types'

const IssueContext = createContext<PollIssue | undefined>(undefined)

export const useIssue = () => {
  const context = useContext(IssueContext)
  if (!context) {
    throw new Error('useIssue must be used within an IssueProvider')
  }
  return context
}
interface IssueProviderProps {
  children: React.ReactNode
  issue: PollIssue
}

export const IssueProvider = ({
  children,
  issue,
}: IssueProviderProps): React.JSX.Element => {
  return <IssueContext.Provider value={issue}>{children}</IssueContext.Provider>
}
