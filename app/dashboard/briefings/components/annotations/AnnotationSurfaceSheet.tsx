'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Drawer, DrawerContent } from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import { cn } from '@styleguide/lib/utils'
import { scrollAnchorIntoView } from '@shared/briefings/anchorResolver'
import { AnnotationCycler } from './AnnotationCycler'
import type { EnrichedAnnotation } from './enrichForCycler'

interface Props {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  positionLabel?: string
  items: EnrichedAnnotation[]
  renderItem: (item: EnrichedAnnotation, index: number) => ReactNode
  footer?: (item: EnrichedAnnotation | null) => ReactNode
  emptyState?: ReactNode
  contentClassName?: string
  initialAnnotationId?: string
}

/**
 * Drawer-hosted shell for an annotation cycler. Composes the generic cycler
 * primitive with a kind-agnostic right-side (desktop) / bottom (mobile)
 * Drawer. Scrolls the briefing canvas to the focused annotation's anchor on
 * each cycler advance.
 */
export function AnnotationSurfaceSheet({
  open,
  onClose,
  title,
  subtitle,
  positionLabel,
  items,
  renderItem,
  footer,
  emptyState,
  contentClassName,
  initialAnnotationId,
}: Props) {
  const isDesktop = !useIsMobile()
  const direction = isDesktop ? 'right' : 'bottom'

  const [selectedId, setSelectedId] = useState<string | null>(
    initialAnnotationId ?? items[0]?.id ?? null,
  )

  // Track the last initialAnnotationId we've bound `selectedId` to. We want
  // to re-bind whenever the parent points us at a different annotation
  // (e.g. surface re-opens with a new target, or a freshly-minted chat hands
  // off from the pending-anchor preempt to the real cycler view), but we
  // don't want to re-fire on every `items` refetch when the id is the same.
  const lastBoundIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (!open) {
      lastBoundIdRef.current = null
      return
    }
    if (!initialAnnotationId) return
    if (lastBoundIdRef.current === initialAnnotationId) return
    lastBoundIdRef.current = initialAnnotationId
    setSelectedId(initialAnnotationId)
    const target = items.find((i) => i.id === initialAnnotationId)
    if (target) scrollAnchorIntoView(target)
  }, [open, initialAnnotationId, items])

  // Track the most recent index the selected id occupied. When the id
  // disappears (typically because the user just deleted it), we use this
  // ref to snap to whatever now sits at the same slot — i.e. the next
  // item slides in. If the deleted item was at the end of the list,
  // fall back to its predecessor.
  const lastIndexRef = useRef<number>(-1)
  useEffect(() => {
    if (!selectedId) return
    const idx = items.findIndex((i) => i.id === selectedId)
    if (idx >= 0) lastIndexRef.current = idx
  }, [items, selectedId])

  useEffect(() => {
    if (!selectedId) return
    if (items.some((i) => i.id === selectedId)) return
    if (items.length === 0) {
      setSelectedId(null)
      return
    }
    const lastIdx = lastIndexRef.current
    // Prefer the item now at the same index (a successor slid up),
    // then the predecessor (we were at the end), then the first item
    // as a last resort.
    const next = items[lastIdx] ?? items[Math.max(0, lastIdx - 1)] ?? items[0]
    if (next) setSelectedId(next.id)
  }, [items, selectedId])

  const foundIndex = selectedId
    ? items.findIndex((i) => i.id === selectedId)
    : -1
  const safeIndex = foundIndex >= 0 ? foundIndex : 0
  const current = foundIndex >= 0 ? items[foundIndex] ?? null : null

  const handleIndexChange = useCallback(
    (next: number) => {
      const target = items[next]
      if (!target) return
      setSelectedId(target.id)
      scrollAnchorIntoView(target)
    },
    [items],
  )

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => (v ? null : onClose())}
      direction={direction}
    >
      <DrawerContent
        className={cn(
          'flex flex-col gap-0 p-0 data-[vaul-drawer-direction=bottom]:max-h-[85vh] data-[vaul-drawer-direction=right]:sm:max-w-[480px]',
          contentClassName,
        )}
      >
        <AnnotationCycler
          title={title}
          subtitle={subtitle}
          positionLabel={positionLabel}
          items={items}
          currentIndex={safeIndex}
          onIndexChange={handleIndexChange}
          renderItem={renderItem}
          getKey={(item) => item.id}
          footer={footer ? footer(current) : undefined}
          emptyState={emptyState}
        />
      </DrawerContent>
    </Drawer>
  )
}
