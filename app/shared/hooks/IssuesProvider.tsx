'use client'
import { createContext, useState } from 'react'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export enum IssueStatus {
  newIssue = 'newIssue',
  accepted = 'accepted',
  inProgress = 'inProgress',
  wontDo = 'wontDo',
  completed = 'completed',
}

export enum IssueChannel {
  inPersonMeeting = 'inPersonMeeting',
  phoneCall = 'phoneCall',
  email = 'email',
  socialMedia = 'socialMedia',
  letterMail = 'letterMail',
  other = 'other',
}

export interface Issue {
  uuid: string
  createdAt: Date | string
  updatedAt: Date | string
  title: string
  description: string
  status: IssueStatus
  channel: IssueChannel
  attachments: string[]
  campaignId: number
}

type IssuesContextValue = [
  issues: Issue[],
  setIssues: (issues: Issue[]) => void,
  refreshIssues: () => Promise<void>
]

export const IssuesContext = createContext<IssuesContextValue>([[], () => {}, async () => {}])

interface IssuesProviderProps {
  children: React.ReactNode
  issues: Issue[]
}

export const IssuesProvider = ({ children, issues: initialIssues }: IssuesProviderProps): React.JSX.Element => {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)

  const refreshIssues = async () => {
    try {
      const resp = await clientFetch<Issue[]>(apiRoutes.issues.list)
      setIssues(resp?.status === 404 || resp.ok === false ? [] : resp.data)
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

