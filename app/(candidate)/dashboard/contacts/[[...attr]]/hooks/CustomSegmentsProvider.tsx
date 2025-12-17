'use client'
import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import {
  fetchCustomSegments,
  type SegmentResponse,
} from '../components/shared/ajaxActions'

type CustomSegmentsContextValue = [
  SegmentResponse[],
  Dispatch<SetStateAction<SegmentResponse[]>>,
  () => Promise<void>,
  string | undefined,
]

export const CustomSegmentContext = createContext<CustomSegmentsContextValue>([
  [],
  () => {},
  async () => {},
  undefined,
])

export const useCustomSegments = (): CustomSegmentsContextValue =>
  useContext(CustomSegmentContext)

interface CustomSegmentsProviderProps {
  children: ReactNode
  customSegments?: SegmentResponse[]
  querySegment?: string
}

export const CustomSegmentsProvider = ({
  children,
  customSegments: initCustomSegments,
  querySegment,
}: CustomSegmentsProviderProps) => {
  const [customSegments, setCustomSegments] = useState<SegmentResponse[]>(
    initCustomSegments || [],
  )

  const refreshCustomSegments = useCallback(async () => {
    const resp = await fetchCustomSegments()
    setCustomSegments(resp || [])
  }, [])

  return (
    <CustomSegmentContext.Provider
      value={[
        customSegments,
        setCustomSegments,
        refreshCustomSegments,
        querySegment,
      ]}
    >
      {children}
    </CustomSegmentContext.Provider>
  )
}
