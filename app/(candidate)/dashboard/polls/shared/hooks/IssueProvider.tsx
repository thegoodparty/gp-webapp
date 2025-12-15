'use client'

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react'

interface PollIssue {
  id: number
  name: string
  position?: string
  importance?: number
}

type IssueContextType = [PollIssue | null, Dispatch<SetStateAction<PollIssue | null>>]

export const IssueContext = createContext<IssueContextType>([
  null,
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
  const [issue, setIssue] = useState<PollIssue | null>(initIssue)

  useEffect(() => {
    setIssue(initIssue)
  }, [initIssue])

  return (
    <IssueContext.Provider value={[issue, setIssue]}>
      {children}
    </IssueContext.Provider>
  )
}
