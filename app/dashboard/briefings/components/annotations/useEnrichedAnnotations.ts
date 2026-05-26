import { useMemo } from 'react'
import type { Annotation } from '@shared/briefings/types'
import { enrichForCycler, type EnrichedAnnotation } from './enrichForCycler'

function signatureOf(
  annotations: Annotation[],
  kind: Annotation['kind'],
): string {
  let s = `${kind}:${annotations.length}`
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
