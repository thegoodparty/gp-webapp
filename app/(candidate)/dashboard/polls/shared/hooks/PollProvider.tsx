'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Poll } from '../poll-types'

export const PollContext = createContext<[Poll | null, (poll: Poll | null) => void]>([
  null,
  () => {},
])

export const usePoll = () => useContext(PollContext)

export const PollProvider: React.FC<{
  children: React.ReactNode
  poll: Poll | null
}> = ({ children, poll: initPoll }) => {
  const [poll, setPoll] = useState(initPoll)

  useEffect(() => {
    setPoll(initPoll)
  }, [initPoll])

  return (
    <PollContext.Provider value={[poll, setPoll]}>
      {children}
    </PollContext.Provider>
  )
}
