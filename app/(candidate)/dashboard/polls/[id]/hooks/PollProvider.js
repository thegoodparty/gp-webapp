'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const PollContext = createContext({
  poll: {},
  setPoll: () => {},
})

export const usePoll = () => useContext(PollContext)

export const PollProvider = ({ children, poll: initPoll }) => {
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
