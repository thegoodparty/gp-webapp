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
    // Attachments mutate independently of `updatedAt` on the parent
    // annotation (presign/complete + delete don't bump it before the
    // 5s OCR poll lands), so include their ids in the signature.
    // Without this, the cycler keeps showing pills for deleted
    // attachments and clicking X again hits the server with a stale
    // id and 404s.
    if (a.note) {
      for (const att of a.note.attachments) {
        s += `;${att.id}`
      }
    }
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
