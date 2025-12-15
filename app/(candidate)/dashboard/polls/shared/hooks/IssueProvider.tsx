'use client'

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react'

interface PollIssue {
  id: number
  name: string
  position?: string
  importance?: number
}

type IssueContextType = [PollIssue, Dispatch<SetStateAction<PollIssue>>]

export const IssueContext = createContext<IssueContextType>([
  {} as PollIssue,
  () => {},
])

export const useIssue = (): IssueContextType => useContext(IssueContext)

interface IssueProviderProps {
  children: React.ReactNode
  issue: PollIssue
}

export const IssueProvider = ({
  children,
  issue: initIssue,
}: IssueProviderProps): React.JSX.Element => {
  const [issue, setIssue] = useState(initIssue)

  useEffect(() => {
    setIssue(initIssue)
  }, [initIssue])

  return (
    <IssueContext.Provider value={[issue, setIssue]}>
      {children}
    </IssueContext.Provider>
  )
}
