'use client'

import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, IconButton } from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import { cn } from '@styleguide/lib/utils'

export interface AnnotationCyclerProps<T> {
  title: ReactNode
  subtitle?: ReactNode
  /**
   * Singular noun shown in the position chip, e.g. "Chat", "Note".
   * Renders as `${positionLabel} ${i} of ${n}`. Defaults to `${i} of ${n}`.
   */
  positionLabel?: string
  items: T[]
  currentIndex: number
  onIndexChange: (index: number) => void
  renderItem: (item: T, index: number) => ReactNode
  getKey: (item: T, index: number) => string
  footer?: ReactNode
  emptyState?: ReactNode
  className?: string
}

export function AnnotationCycler<T>({
  title,
  subtitle,
  positionLabel,
  items,
  currentIndex,
  onIndexChange,
  renderItem,
  getKey,
  footer,
  emptyState,
  className,
}: AnnotationCyclerProps<T>) {
  const isMobile = useIsMobile()
  const isEmpty = items.length === 0
  const safeIndex = Math.max(0, Math.min(items.length - 1, currentIndex))
  const current: T | null = isEmpty ? null : items[safeIndex] ?? null
  const prevDisabled = isEmpty || safeIndex === 0
  const nextDisabled = isEmpty || safeIndex >= items.length - 1

  const goPrev = useCallback(() => {
    if (prevDisabled) return
    onIndexChange(safeIndex - 1)
  }, [prevDisabled, safeIndex, onIndexChange])

  const goNext = useCallback(() => {
    if (nextDisabled) return
    onIndexChange(safeIndex + 1)
  }, [nextDisabled, safeIndex, onIndexChange])

  const regionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = regionRef.current
    if (!node) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      // Only intercept arrows when focus is on the region wrapper itself,
      // never when a focusable descendant (button, input, link, etc.) is focused.
      if (document.activeElement !== node) return
      e.preventDefault()
      if (e.key === 'ArrowLeft') goPrev()
      else goNext()
    }
    node.addEventListener('keydown', onKey)
    return () => node.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={
        isEmpty
          ? 'Annotation cycler'
          : `Annotation cycler, ${safeIndex + 1} of ${items.length}`
      }
      tabIndex={0}
      className={cn('flex h-full min-h-0 flex-col outline-none', className)}
    >
      <header className="flex flex-col gap-2 border-b border-border px-6 pb-4 pt-6">
        {title ? (
          <div className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </div>
        ) : null}
        {!isEmpty ? (
          <div className="flex items-center justify-center gap-3">
            <IconButton
              variant="ghost"
              size={isMobile ? 'medium' : 'small'}
              aria-label="Previous"
              onClick={goPrev}
              disabled={prevDisabled}
            >
              <ChevronLeftIcon className="size-4" />
            </IconButton>
            <span className="text-sm font-medium text-foreground">
              {positionLabel ? `${positionLabel} ` : ''}
              {safeIndex + 1} of {items.length}
            </span>
            <IconButton
              variant="ghost"
              size={isMobile ? 'medium' : 'small'}
              aria-label="Next"
              onClick={goNext}
              disabled={nextDisabled}
            >
              <ChevronRightIcon className="size-4" />
            </IconButton>
          </div>
        ) : null}
        {subtitle ? (
          <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden px-6 pt-4">
        {isEmpty ? (
          emptyState ?? null
        ) : current !== null ? (
          <div
            key={getKey(current, safeIndex)}
            className="flex min-h-0 min-w-0 flex-1 flex-col"
          >
            {renderItem(current, safeIndex)}
          </div>
        ) : null}
      </div>

      {footer ? <div className="px-6 pb-6 pt-2">{footer}</div> : null}
    </div>
  )
}
