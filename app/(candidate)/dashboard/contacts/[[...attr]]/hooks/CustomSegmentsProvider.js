'use client'
import { createContext, useCallback, useContext, useState } from 'react'
import { fetchCustomSegments } from '../components/ajaxActions'

export const CustomSegmentContext = createContext({
  customSegments: [],
  setCustomSegments: () => {},
  refreshCustomSegments: () => {},
})

export const useCustomSegments = () => useContext(CustomSegmentContext)

export const CustomSegmentsProvider = ({
  children,
  customSegments: initCustomSegments,
}) => {
  const [customSegments, setCustomSegments] = useState(initCustomSegments || [])

  const refreshCustomSegments = useCallback(async () => {
    const resp = await fetchCustomSegments()
    setCustomSegments(resp || [])
  }, [])

  return (
    <CustomSegmentContext.Provider
      value={[customSegments, setCustomSegments, refreshCustomSegments]}
    >
      {children}
    </CustomSegmentContext.Provider>
  )
}
