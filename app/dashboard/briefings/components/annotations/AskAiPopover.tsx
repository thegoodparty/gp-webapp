'use client'

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Sparkles, X } from 'lucide-react'
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@styleguide'
import type { AnnotationAnchor } from '@shared/briefings/types'
import AskAiChatBody from './AskAiChatBody'

type Props = {
  meetingDate: string
  anchor: AnnotationAnchor | null
  trigger: React.ReactElement
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Optional existing annotation id. When provided, the popover skips
   * `createBriefingChat` and loads the prior messages immediately. Use
   * this when re-opening an existing chat annotation from the highlight
   * layer.
   */
  existingAnnotationId?: string
  /**
   * Fires once after `POST /v1/briefing-chats` succeeds. Callers wire
   * this to invalidate the briefing annotations query so the new
   * chat-kind annotation renders in the highlight layer without
   * waiting for a refetch.
   */
  onChatCreated?: (info: {
    annotationId: string
    conversationId: string
    anchor: AnnotationAnchor | null
  }) => void
}

/**
 * Popover-based Ask AI surface anchored to a trigger button. Used by the
 * top-of-page "Ask AI" header button (desktop + mobile FAB). Selection-
 * spawned and existing-chat overlays render in `AskAiSheet` instead.
 *
 * The chat conversation, composer, suggested pills, and streaming logic all
 * live in `AskAiChatBody`. This component owns popover-specific bits only:
 * trigger, alignment, sizing, and the inline close button.
 */
export default function AskAiPopover({
  meetingDate,
  anchor,
  trigger,
  align = 'end',
  side = 'bottom',
  open: controlledOpen,
  onOpenChange,
  existingAnnotationId,
  onChatCreated,
}: Props): React.JSX.Element {
  const [internalOpen, setInternalOpen] = useState(false)
  const [createdAnnotationId, setCreatedAnnotationId] = useState<
    string | undefined
  >(existingAnnotationId)
  const resolvedAnnotationId = existingAnnotationId ?? createdAnnotationId

  const handleChatCreated = useCallback(
    (info: { annotationId: string; conversationId: string }) => {
      setCreatedAnnotationId(info.annotationId)
      onChatCreated?.({ ...info, anchor })
    },
    [anchor, onChatCreated],
  )
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  // Close on viewport width change (window resize, device rotation, browser
  // zoom). Skip height-only changes so a mobile virtual keyboard popping
  // up doesn't dismiss the popover.
  const lastWidthRef = useRef<number>(
    typeof window === 'undefined' ? 0 : window.innerWidth,
  )
  useEffect(() => {
    if (!open) return
    lastWidthRef.current = window.innerWidth
    const onResize = () => {
      if (window.innerWidth !== lastWidthRef.current) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open, setOpen])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isValidElement(trigger)
          ? cloneElement(trigger)
          : (trigger as React.ReactNode)}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        className="flex w-[400px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl p-0 shadow-xl"
        onEscapeKeyDown={() => setOpen(false)}
      >
        <div className="flex items-center gap-3 border-b border-base-border px-4 py-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="flex-1 text-sm font-semibold">
            Briefing assistant
          </span>
          <IconButton
            type="button"
            size="small"
            variant="ghost"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" aria-hidden />
          </IconButton>
        </div>

        <AskAiChatBody
          meetingDate={meetingDate}
          anchor={anchor}
          annotationIdOverride={resolvedAnnotationId}
          showInlineHeader={false}
          active={open}
          onChatCreated={handleChatCreated}
        />
      </PopoverContent>
    </Popover>
  )
}
