'use client'

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react'

interface PollIssue {
  id: number
  name: string
  position?: string
  importance?: number
}

type IssuesContextType = [PollIssue[], Dispatch<SetStateAction<PollIssue[]>>]

export const IssuesContext = createContext<IssuesContextType>([[], () => {}])

export const useIssues = (): IssuesContextType => useContext(IssuesContext)

interface IssuesProviderProps {
  children: React.ReactNode
  issues?: PollIssue[]
}

export const IssuesProvider = ({
  children,
  issues: initIssues = [],
}: IssuesProviderProps): React.JSX.Element => {
  const [issues, setIssues] = useState(initIssues)

  useEffect(() => {
    setIssues(initIssues)
  }, [initIssues])

  return (
    <IssuesContext.Provider value={[issues, setIssues]}>
      {children}
    </IssuesContext.Provider>
  )
}
