'use client'

import { useCallback, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Check, Copy, Download, Link2, Mail, MessageSquare } from 'lucide-react'
import {
  Button,
  IconButton,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@styleguide'
import { APP_BASE } from 'appEnv'
import { cn } from '@styleguide/lib/utils'
import type { Briefing } from '@shared/briefings/types'

type Props = {
  briefing: Briefing
  open: boolean
  onOpenChange: (open: boolean) => void
}

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
    if (await writeClipboard()) {
      setCopiedIcon(true)
      window.setTimeout(() => setCopiedIcon(false), 1500)
    }
  }, [writeClipboard])

  const onCopyInline = useCallback(async () => {
    if (await writeClipboard()) {
      setCopiedInline(true)
      window.setTimeout(() => setCopiedInline(false), 1500)
    }
  }, [writeClipboard])

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
              <Check className="size-5" aria-hidden />
            ) : (
              <Copy className="size-5" aria-hidden />
            )}
          </ShareAction>

          <ShareAction asChild label="Email" ariaLabel="Share via email">
            <a href={mailtoHref}>
              <Mail className="size-5" aria-hidden />
            </a>
          </ShareAction>

          <ShareAction asChild label="Message" ariaLabel="Share via message">
            <a href={smsHref}>
              <MessageSquare className="size-5" aria-hidden />
            </a>
          </ShareAction>

          <ShareAction asChild label="Download" ariaLabel="Download PDF">
            {/* `download` hints the browser to save the file; the server
                sends `Content-Disposition: inline` so a non-saving open
                in a new tab also works fine. */}
            <a href={shareUrl} download>
              <Download className="size-5" aria-hidden />
            </a>
          </ShareAction>
        </div>

        <div
          className={cn(
            'mt-4 flex items-center gap-2 rounded-full border border-border bg-muted/40 py-1 pl-3 pr-1',
          )}
        >
          <Link2
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
            // Force the GoodParty primary blue so the Copy CTA is visually
            // distinct from the muted URL pill it sits inside, regardless of
            // any contextual button styling further up the cascade.
            className="border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700"
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
  const formattedDate = formatMeetingDate(briefing.meeting_date)
  if (formattedDate) parts.push(formattedDate)
  const formattedTime = formatMeetingTime(briefing.meeting_time)
  if (formattedTime) parts.push(formattedTime)
  if (briefing.location) parts.push(briefing.location)
  return parts.join(' · ')
}

function formatMeetingDate(meetingDate: string | undefined): string {
  if (!meetingDate) return ''
  try {
    return format(parseISO(meetingDate), 'EEE MMM d')
  } catch {
    return meetingDate
  }
}

function formatMeetingTime(meetingTime: string | undefined): string {
  if (!meetingTime) return ''
  // Briefing artifact gives us `HH:MM` in local meeting tz. Render as `h:mm a`.
  const [hhRaw, mmRaw] = meetingTime.split(':')
  const h24 = Number(hhRaw)
  const mm = mmRaw ?? ''
  if (!Number.isFinite(h24) || mm.length !== 2) return meetingTime
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${mm} ${ampm}`
}
