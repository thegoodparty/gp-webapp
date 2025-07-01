'use client'
import { useContext } from 'react'
import { IssuesContext } from './IssuesProvider'

export const useIssues = () => useContext(IssuesContext)
