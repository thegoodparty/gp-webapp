import type { Annotation } from '@shared/briefings/types'
import { resolveAnnotationHighlight } from '@shared/briefings/anchorResolver'
import { compareForCycler } from './annotationSort'

const ANCHOR_ATTR = 'data-briefing-json-path'

export interface EnrichedAnnotation extends Annotation {
  docOrderIndex: number | null
  highlightedText: string | null
}

interface DomCache {
  position: (jsonPath: string | null) => number | null
  lookup: (jsonPath: string) => HTMLElement | null
}

const emptyCache: DomCache = {
  position: () => null,
  lookup: () => null,
}

function buildDomCache(): DomCache {
  if (typeof document === 'undefined') return emptyCache
  const nodes = document.querySelectorAll(`[${ANCHOR_ATTR}]`)
  const els: HTMLElement[] = []
  nodes.forEach((node) => {
    if (node instanceof HTMLElement) els.push(node)
  })
  if (els.length === 0) return emptyCache
  const map = new Map<string, { index: number; el: HTMLElement }>()
  els.forEach((el, index) => {
    const path = el.getAttribute(ANCHOR_ATTR)
    if (path && !map.has(path)) map.set(path, { index, el })
  })
  return {
    position: (path) => {
      if (path === null) return null
      return map.get(path)?.index ?? null
    },
    lookup: (path) => map.get(path)?.el ?? null,
  }
}

export interface PredictedPosition {
  position: number
  total: number
}

export function predictNewAnnotationPosition(
  annotations: Annotation[],
  kind: Annotation['kind'],
  anchor: { jsonPath: string | null; start: number | null } | null,
): PredictedPosition {
  const filtered = annotations.filter((a) => a.kind === kind)
  const cache = buildDomCache()
  const existing = filtered.map((a) => ({
    jsonPath: a.jsonPath,
    docOrderIndex: cache.position(a.jsonPath),
    start: a.start,
    createdAt: a.createdAt,
  }))
  const draft = {
    jsonPath: anchor?.jsonPath ?? null,
    docOrderIndex: anchor?.jsonPath ? cache.position(anchor.jsonPath) : null,
    start: anchor?.start ?? null,
    createdAt: new Date().toISOString(),
  }
  const combined = [...existing, draft].sort(compareForCycler)
  const idx = combined.findIndex((c) => c === draft)
  return { position: idx + 1, total: combined.length }
}

export function findAnnotationPosition(
  annotations: Annotation[],
  kind: Annotation['kind'],
  annotationId: string,
): PredictedPosition | null {
  const sorted = enrichForCycler(annotations, kind)
  const idx = sorted.findIndex((a) => a.id === annotationId)
  if (idx < 0) return null
  return { position: idx + 1, total: sorted.length }
}

export function enrichForCycler(
  annotations: Annotation[],
  kind?: Annotation['kind'],
): EnrichedAnnotation[] {
  const filtered = kind
    ? annotations.filter((a) => a.kind === kind)
    : annotations
  const cache = buildDomCache()
  const enriched: EnrichedAnnotation[] = filtered.map((a) => ({
    ...a,
    docOrderIndex: cache.position(a.jsonPath),
    highlightedText: resolveAnnotationHighlight(a, cache.lookup),
  }))
  enriched.sort((a, b) =>
    compareForCycler(
      {
        jsonPath: a.jsonPath,
        docOrderIndex: a.docOrderIndex,
        start: a.start,
        createdAt: a.createdAt,
      },
      {
        jsonPath: b.jsonPath,
        docOrderIndex: b.docOrderIndex,
        start: b.start,
        createdAt: b.createdAt,
      },
    ),
  )
  return enriched
}
