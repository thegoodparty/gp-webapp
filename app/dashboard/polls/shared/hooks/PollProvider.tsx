'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Poll } from '../poll-types'

export const PollContext = createContext<[Poll]>([{} as Poll])

export const usePoll = () => useContext(PollContext)

export const PollProvider: React.FC<{
  children: React.ReactNode
  poll: Poll
}> = ({ children, poll: initPoll }) => {
  const [poll, setPoll] = useState(initPoll)

  useEffect(() => {
    setPoll(initPoll)
  }, [initPoll])

  return <PollContext.Provider value={[poll]}>{children}</PollContext.Provider>
}
