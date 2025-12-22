export const dateColumnSort = (dateA: string | number | Date | null | undefined, dateB: string | number | Date | null | undefined): number => {
  const a = dateA
  const b = dateB
  let errorA = false
  let errorB = false
  let aDate: number | undefined
  let bDate: number | undefined

  try {
    if (a) {
      aDate = new Date(a).getTime()
    }
  } catch (e) {
    errorA = true
  }
  try {
    if (b) {
      bDate = new Date(b).getTime()
    }
  } catch (e) {
    errorB = true
  }
  if ((!a && !b) || (!aDate && !bDate) || (errorA && errorB)) {
    return 0
  }
  if (!a || a === '' || !aDate || errorA) {
    return -1
  }
  if (!b || b === '' || !bDate || errorB) {
    return 1
  }
  if (aDate < bDate) return -1
  else if (aDate > bDate) return 1
  else return 0
}

