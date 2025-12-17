interface Segment {
  id: number
  name?: string
}

interface DefaultSegment {
  value: string
}

export const isCustomSegment = (
  customSegments: Segment[],
  querySegment: string,
): boolean => {
  return customSegments.some((segment) => segment.id === parseInt(querySegment))
}

export const isDefaultSegment = (
  defaultSegments: DefaultSegment[],
  querySegment: string,
): boolean => {
  return defaultSegments.some(
    (defaultSegment) => defaultSegment.value === querySegment,
  )
}

export const findCustomSegment = (
  customSegments: Segment[],
  querySegment: string,
): Segment | undefined => {
  return customSegments.find((segment) => segment.id === parseInt(querySegment))
}

export const filterOnlyTrueValues = (
  filters: Record<string, boolean>,
): string[] => {
  return Object.keys(filters).filter((key) => filters[key] === true)
}

const MAX_SEGMENT_NAME_LENGTH = 20

export const trimCustomSegmentName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return 'custom segment'
  }

  if (name.length > MAX_SEGMENT_NAME_LENGTH) {
    if (name.includes('Campaign')) {
      const campaignEndIndex = name.indexOf('Campaign') + 8
      return campaignEndIndex <= MAX_SEGMENT_NAME_LENGTH
        ? name.slice(0, campaignEndIndex)
        : name.slice(0, MAX_SEGMENT_NAME_LENGTH) + '...'
    }
    return name.slice(0, MAX_SEGMENT_NAME_LENGTH) + '...'
  }
  return name
}
