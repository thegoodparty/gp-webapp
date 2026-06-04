'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@styleguide'

export interface PlanSectionRef {
  id: string
  label: string
}

interface PlanSectionNavProps {
  sections: PlanSectionRef[]
  onStuckChange?: (stuck: boolean) => void
}

// Activate a section when its top sits in the upper half of the viewport,
// below the sticky nav.
const OBSERVER_ROOT_MARGIN = '-120px 0px -55% 0px'

const PlanSectionNav = ({
  sections,
  onStuckChange,
}: PlanSectionNavProps): React.JSX.Element => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const [isStuck, setIsStuck] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const onScroll = () => {
      const top = el.getBoundingClientRect().top
      setIsStuck(top <= 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    onStuckChange?.(isStuck)
  }, [isStuck, onStuckChange])

  // When sections changes (e.g. Section 2 drops out after strategy
  // resolves ready-but-empty), the previously-tracked activeId may no
  // longer be in the list. The controlled <Select value={activeId}>
  // would then have no matching <SelectItem> — Radix renders an empty
  // trigger with no label until the user clicks. Snap activeId back to
  // the first available section whenever the list shrinks past it.
  useEffect(() => {
    if (sections.length === 0) return
    if (!sections.some((s) => s.id === activeId)) {
      setActiveId(sections[0]?.id ?? '')
    }
    // Intentionally omit activeId from deps — we only want to re-check
    // when sections changes, not every time we update activeId here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections])

  useEffect(() => {
    if (sections.length === 0) return

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          )
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: OBSERVER_ROOT_MARGIN, threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  const handleChange = (value: string) => {
    setActiveId(value)
    const el = document.getElementById(value)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={
        isStuck
          ? 'sticky top-0 z-30 mx-[calc(50%-50vw)] w-screen border-b border-base-border bg-base-surface'
          : 'sticky top-0 z-30 rounded-xl border border-base-border bg-base-surface px-3 py-2 shadow-sm'
      }
    >
      <div
        className={isStuck ? 'mx-auto w-full max-w-4xl px-4 py-2 sm:px-8' : ''}
      >
        <p className="px-1 pt-1 text-xs font-medium text-muted-foreground">
          Jump to
        </p>
        <Select value={activeId} onValueChange={handleChange}>
          <SelectTrigger className="h-10 w-full border-none px-1 shadow-none focus-visible:ring-0">
            <SelectValue placeholder="Jump to a section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PlanSectionNav
