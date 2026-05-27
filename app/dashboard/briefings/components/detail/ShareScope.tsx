'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Briefing } from '@shared/briefings/types'
import ShareBriefingDrawer from './ShareBriefingDrawer'

/**
 * Per-briefing share state. The drawer used to be mounted twice
 * (`DetailHeaderActions` for desktop, `MobileBottomBar` for mobile), each
 * with its own copy of `briefing`, `shareUrl`, the `Sheet` portal, and the
 * `Copy` setTimeout. Two `<Sheet>` instances also meant Radix's focus-trap
 * logic could race between them after the breakpoint changed.
 *
 * `ShareScope` owns the only `<ShareBriefingDrawer>` on the page and exposes
 * an `openShareDrawer()` callback the two action surfaces consume.
 */
type ShareScopeValue = {
  openShareDrawer: () => void
}

const ShareScopeContext = createContext<ShareScopeValue | null>(null)

type Props = {
  briefing: Briefing
  children: ReactNode
}

export default function ShareScope({
  briefing,
  children,
}: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const openShareDrawer = useCallback(() => setOpen(true), [])

  const value = useMemo<ShareScopeValue>(
    () => ({ openShareDrawer }),
    [openShareDrawer],
  )

  return (
    <ShareScopeContext.Provider value={value}>
      {children}
      <ShareBriefingDrawer
        briefing={briefing}
        open={open}
        onOpenChange={setOpen}
      />
    </ShareScopeContext.Provider>
  )
}

export function useShareScope(): ShareScopeValue {
  const ctx = useContext(ShareScopeContext)
  if (!ctx) {
    throw new Error('useShareScope must be used inside <ShareScope>')
  }
  return ctx
}
