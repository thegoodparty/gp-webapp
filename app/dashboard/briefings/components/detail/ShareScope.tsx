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
  /**
   * `true` when the briefing carries a usable `briefing_id` (the server-side
   * PDF share token). Consumers should hide share entry-points when this is
   * `false` — typically during a rolling-deploy window where gp-webapp
   * shipped before gp-api added the field to its response. Falsy here means
   * "we can't build a working share URL right now".
   */
  canShare: boolean
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
  const canShare = Boolean(briefing.briefing_id)
  const openShareDrawer = useCallback(() => {
    // Guard at the dispatch site so a stale UI that still renders the
    // entry-point can't accidentally open a drawer pointed at
    // `/api/v1/briefings/undefined`.
    if (!canShare) return
    setOpen(true)
  }, [canShare])

  const value = useMemo<ShareScopeValue>(
    () => ({ canShare, openShareDrawer }),
    [canShare, openShareDrawer],
  )

  return (
    <ShareScopeContext.Provider value={value}>
      {children}
      {canShare && (
        <ShareBriefingDrawer
          briefing={briefing}
          open={open}
          onOpenChange={setOpen}
        />
      )}
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
