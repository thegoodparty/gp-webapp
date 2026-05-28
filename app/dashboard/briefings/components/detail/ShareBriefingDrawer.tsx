'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  IconButton,
  Link2Icon,
  MailIcon,
  MessageSquareIcon,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@styleguide'
import { APP_BASE } from 'appEnv'
import { cn } from '@styleguide/lib/utils'
import type { Briefing } from '@shared/briefings/types'
import {
  formatBriefingMeetingDate,
  formatBriefingMeetingTime,
} from '@shared/briefings/dateHelpers'

type Props = {
  briefing: Briefing
  open: boolean
  onOpenChange: (open: boolean) => void
}

const COPIED_FEEDBACK_MS = 1500

/**
 * Bottom-anchored share sheet. Four circular actions (Copy link, Email,
 * Message, Download) plus an inline URL pill with a Copy button all drive
 * the same public PDF URL served by the gp-api PDF endpoint via the
 * Vercel rewrite at `/api/v1/briefings/:uuid`.
 */
export default function ShareBriefingDrawer({
  briefing,
  open,
  onOpenChange,
}: Props): React.JSX.Element {
  const shareUrl = useMemo(
    () => buildShareUrl(briefing.briefing_id),
    [briefing.briefing_id],
  )
  const subtext = useMemo(() => buildSubtext(briefing), [briefing])

  const mailtoHref = useMemo(
    () =>
      `mailto:?subject=${encodeURIComponent(
        briefing.title,
      )}&body=${encodeURIComponent(shareUrl)}`,
    [briefing.title, shareUrl],
  )
  // Use the iOS-friendly `sms:?body=` form (no recipient). Android and iOS
  // both accept this when the link comes from a web page.
  const smsHref = useMemo(
    () => `sms:?body=${encodeURIComponent(shareUrl)}`,
    [shareUrl],
  )

  const [copiedIcon, setCopiedIcon] = useState(false)
  const [copiedInline, setCopiedInline] = useState(false)

  // Cache the active feedback timers in refs so that:
  //  (a) Component unmount cancels them — preventing the "setState on
  //      unmounted component" warning when the drawer is closed quickly.
  //  (b) Rapid double-clicks reset the timer rather than stacking handlers.
  const copiedIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copiedInlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  useEffect(() => {
    return () => {
      if (copiedIconTimerRef.current !== null) {
        clearTimeout(copiedIconTimerRef.current)
      }
      if (copiedInlineTimerRef.current !== null) {
        clearTimeout(copiedInlineTimerRef.current)
      }
    }
  }, [])

  // The drawer lives at the layout level inside `ShareScope` and only its
  // visibility — not its mount — toggles with `open`. The unmount cleanup
  // above therefore only fires on full page teardown. Without this second
  // effect, closing the drawer mid-feedback (within `COPIED_FEEDBACK_MS`)
  // and reopening it would surface a stale "Copied" label until the timer
  // expired. Cancel any pending timer and reset the labels every time the
  // drawer closes so each open starts clean.
  useEffect(() => {
    if (open) return
    if (copiedIconTimerRef.current !== null) {
      clearTimeout(copiedIconTimerRef.current)
      copiedIconTimerRef.current = null
    }
    if (copiedInlineTimerRef.current !== null) {
      clearTimeout(copiedInlineTimerRef.current)
      copiedInlineTimerRef.current = null
    }
    setCopiedIcon(false)
    setCopiedInline(false)
  }, [open])

  const writeClipboard = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false
    try {
      await navigator.clipboard.writeText(shareUrl)
      return true
    } catch {
      // clipboard write can fail in insecure contexts or when the user
      // denies permission; callers leave the UI unchanged in that case.
      return false
    }
  }, [shareUrl])

  const onCopyIcon = useCallback(async () => {
    if (!(await writeClipboard())) return
    setCopiedIcon(true)
    if (copiedIconTimerRef.current !== null) {
      clearTimeout(copiedIconTimerRef.current)
    }
    copiedIconTimerRef.current = setTimeout(() => {
      setCopiedIcon(false)
      copiedIconTimerRef.current = null
    }, COPIED_FEEDBACK_MS)
  }, [writeClipboard])

  const onCopyInline = useCallback(async () => {
    if (!(await writeClipboard())) return
    setCopiedInline(true)
    if (copiedInlineTimerRef.current !== null) {
      clearTimeout(copiedInlineTimerRef.current)
    }
    copiedInlineTimerRef.current = setTimeout(() => {
      setCopiedInline(false)
      copiedInlineTimerRef.current = null
    }, COPIED_FEEDBACK_MS)
  }, [writeClipboard])

  // A plain `<a href={pdfUrl} download>` is unreliable here: gp-api serves
  // the PDF with `Content-Disposition: inline`, and browsers — especially
  // Chrome with its built-in PDF viewer — frequently ignore the `download`
  // hint and open the file inline instead. Fetching the bytes and
  // triggering a download against a blob URL forces save-as behavior
  // regardless of the server's disposition header.
  const onDownload = useCallback(async () => {
    try {
      const res = await fetch(shareUrl, { credentials: 'include' })
      if (!res.ok) return
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = `${briefing.title || 'briefing'}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      // Network/parse failures leave the UI unchanged; the user can retry.
    }
  }, [shareUrl, briefing.title])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-4 pb-8 pt-3 sm:mx-auto sm:max-w-md"
        data-testid="share-briefing-drawer"
      >
        {/* Decorative grab handle, matches the mobile-share-sheet pattern. */}
        <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-muted" />

        <SheetHeader className="px-0 pt-2 pb-0">
          <SheetTitle className="text-lg">Share briefing</SheetTitle>
          <SheetDescription className="truncate">{subtext}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <ShareAction
            label={copiedIcon ? 'Copied' : 'Copy link'}
            onClick={onCopyIcon}
            ariaLabel="Copy link"
          >
            {copiedIcon ? (
              <CheckIcon className="size-5" aria-hidden />
            ) : (
              <CopyIcon className="size-5" aria-hidden />
            )}
          </ShareAction>

          <ShareAction asChild label="Email" ariaLabel="Share via email">
            <a href={mailtoHref}>
              <MailIcon className="size-5" aria-hidden />
            </a>
          </ShareAction>

          <ShareAction asChild label="Message" ariaLabel="Share via message">
            <a href={smsHref}>
              <MessageSquareIcon className="size-5" aria-hidden />
            </a>
          </ShareAction>

          <ShareAction
            label="Download"
            ariaLabel="Download PDF"
            onClick={onDownload}
          >
            <DownloadIcon className="size-5" aria-hidden />
          </ShareAction>
        </div>

        <div
          className={cn(
            'mt-4 flex items-center gap-2 rounded-full border border-border bg-muted/40 py-1 pl-3 pr-1',
          )}
        >
          <Link2Icon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <span
            className="min-w-0 flex-1 truncate text-sm text-muted-foreground"
            data-testid="share-briefing-url"
          >
            {shareUrl}
          </span>
          <Button
            type="button"
            variant="default"
            size="xSmall"
            // Use the design-system `primary` token (mapped to GoodParty's
            // brand blue) rather than the raw Tailwind palette, per the
            // root CLAUDE.md design-tokens rule. The Copy CTA stays
            // visually distinct from the muted URL pill via the solid
            // primary color, regardless of context.
            className="border-primary bg-primary text-primary-foreground hover:border-primary/90 hover:bg-primary/90"
            onClick={onCopyInline}
          >
            {copiedInline ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

type ShareActionProps = {
  label: string
  ariaLabel: string
  children: React.ReactNode
  asChild?: boolean
  onClick?: () => void
}

function ShareAction({
  label,
  ariaLabel,
  children,
  asChild = false,
  onClick,
}: ShareActionProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-2">
      <IconButton
        type="button"
        variant="outline"
        size="large"
        aria-label={ariaLabel}
        asChild={asChild}
        onClick={onClick}
      >
        {children}
      </IconButton>
      <span className="text-center text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function buildShareUrl(briefingId: string): string {
  return `${APP_BASE}/api/v1/briefings/${briefingId}`
}

function buildSubtext(briefing: Briefing): string {
  const parts: string[] = []
  if (briefing.meeting_name) parts.push(briefing.meeting_name)
  const formattedDate = formatBriefingMeetingDate(briefing.meeting_date)
  if (formattedDate) parts.push(formattedDate)
  const formattedTime = formatBriefingMeetingTime(briefing.meeting_time)
  if (formattedTime) parts.push(formattedTime)
  if (briefing.location) parts.push(briefing.location)
  return parts.join(' · ')
}
