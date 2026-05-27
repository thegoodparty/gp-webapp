import { useMemo } from 'react'
import type { Annotation } from '@shared/briefings/types'
import { enrichForCycler, type EnrichedAnnotation } from './enrichForCycler'

function signatureOf(
  annotations: Annotation[],
  kind: Annotation['kind'],
): string {
  // Count only annotations of this kind — using total `annotations.length`
  // would churn the signature on every add/remove of an unrelated kind and
  // trigger pointless re-enrichment.
  let count = 0
  for (const a of annotations) {
    if (a.kind === kind) count++
  }
  let s = `${kind}:${count}`
  for (const a of annotations) {
    if (a.kind !== kind) continue
    s += `|${a.id}:${a.updatedAt}:${a.jsonPath ?? ''}`
  }
  return s
}

export function useEnrichedAnnotations(
  open: boolean,
  annotations: Annotation[],
  kind: Annotation['kind'],
): EnrichedAnnotation[] {
  const signature = signatureOf(annotations, kind)
  return useMemo(
    () => (open ? enrichForCycler(annotations, kind) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- signature captures annotation content
    [open, kind, signature],
  )
}
