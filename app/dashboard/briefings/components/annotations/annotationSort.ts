export interface SortableAnnotation {
  jsonPath: string | null
  docOrderIndex: number | null
  start: number | null
  createdAt: Date | string
}

type Bucket = 'unanchored' | 'resolved' | 'unresolved'

const BUCKET_ORDER: Record<Bucket, number> = {
  unanchored: 0,
  resolved: 1,
  unresolved: 2,
}

const bucketOf = (a: SortableAnnotation): Bucket => {
  if (a.jsonPath === null) return 'unanchored'
  if (a.docOrderIndex !== null) return 'resolved'
  return 'unresolved'
}

const toMs = (d: Date | string): number =>
  d instanceof Date ? d.getTime() : new Date(d).getTime()

export const compareForCycler = (
  a: SortableAnnotation,
  b: SortableAnnotation,
): number => {
  const ba = bucketOf(a)
  const bb = bucketOf(b)
  if (ba !== bb) return BUCKET_ORDER[ba] - BUCKET_ORDER[bb]
  if (ba === 'resolved') {
    const indexDiff = (a.docOrderIndex ?? 0) - (b.docOrderIndex ?? 0)
    if (indexDiff !== 0) return indexDiff
    const startDiff = (a.start ?? 0) - (b.start ?? 0)
    if (startDiff !== 0) return startDiff
  }
  return toMs(a.createdAt) - toMs(b.createdAt)
}
