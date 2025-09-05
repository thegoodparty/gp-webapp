'use client'

import { createContext, useContext, useState } from 'react'

export const CustomSegmentContext = createContext({
  customSegments: [],
  setCustomSegments: () => {},
})

export const useCustomSegments = () => useContext(CustomSegmentContext)

export const CustomSegmentsProvider = ({
  children,
  customSegments: initCustomSegments,
}) => {
  const [customSegments, setCustomSegments] = useState(initCustomSegments || [])
  return (
    <CustomSegmentContext.Provider value={[customSegments, setCustomSegments]}>
      {children}
    </CustomSegmentContext.Provider>
  )
}
