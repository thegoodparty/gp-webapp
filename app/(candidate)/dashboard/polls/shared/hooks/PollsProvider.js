'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const PollsContext = createContext({
  polls: {},
  setPolls: () => {},
})

export const usePolls = () => useContext(PollsContext)

export const PollsProvider = ({ children, polls: initPolls }) => {
  const [polls, setPolls] = useState(initPolls)

  useEffect(() => {
    setPolls(initPolls)
  }, [initPolls])

  return (
    <PollsContext.Provider value={[polls, setPolls]}>
      {children}
    </PollsContext.Provider>
  )
}
