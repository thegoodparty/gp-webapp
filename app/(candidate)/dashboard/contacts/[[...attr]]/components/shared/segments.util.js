export const isCustomSegment = (customSegments, querySegment) => {
  return customSegments.some((segment) => segment.id === parseInt(querySegment))
}

export const isDefaultSegment = (defaultSegments, querySegment) => {
  return defaultSegments.some(
    (defaultSegment) => defaultSegment.value === querySegment,
  )
}

export const findCustomSegment = (customSegments, querySegment) => {
  return customSegments.find((segment) => segment.id === parseInt(querySegment))
}

export const filterOnlyTrueValues = (filters) => {
  return Object.keys(filters).filter((key) => filters[key] === true)
}

const MAX_SEGMENT_NAME_LENGTH = 20

export const trimCustomSegmentName = (name) => {
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
