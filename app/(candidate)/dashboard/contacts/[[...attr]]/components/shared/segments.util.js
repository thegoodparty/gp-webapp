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
