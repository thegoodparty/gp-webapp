'use client'
import { useContext } from 'react'
import { IssuesContext } from './IssuesProvider'

export const useIssues = () => {
  const context = useContext(IssuesContext)
  if (!context) {
    throw new Error('useIssues must be used within an IssuesProvider')
  }

  return context
}
