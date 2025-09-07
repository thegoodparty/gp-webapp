'use client'

import { createContext, useContext, useState } from 'react'

export const SegmentContext = createContext({
  segment: {},
  setSegment: () => {},
})

export const useSegment = () => useContext(SegmentContext)

export const SegmentProvider = ({ children }) => {
  const [segment, setSegment] = useState({})
  return (
    <SegmentContext.Provider value={[segment, setSegment]}>
      {children}
    </SegmentContext.Provider>
  )
}
