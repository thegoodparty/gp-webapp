'use client'

import { useCallback, useMemo } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import type { AnnotationAnchor } from '@shared/briefings/types'
import type { OverlayState } from './AnnotationsScope'
import AskAiChatBody from './AskAiChatBody'
import { useClearSelectionOnOpen } from './useClearSelectionOnOpen'

type Props = {
  sheet: OverlayState
  meetingDate: string
  onClose: () => void
  onChatCreated?: (info: {
    annotationId: string
    conversationId: string
    anchor: AnnotationAnchor | null
  }) => void
}

function isAskAiSheetState(state: OverlayState): boolean {
  return state.kind === 'ask_ai_anchored' || state.kind === 'ask_ai_existing'
}

function quoteFor(state: OverlayState): string | null {
  if (state.kind === 'ask_ai_anchored') return state.anchor.quote
  if (state.kind === 'ask_ai_existing') return state.quote ?? null
  return null
}

function anchorFor(state: OverlayState): AnnotationAnchor | null {
  if (state.kind === 'ask_ai_anchored') {
    return {
      jsonPath: state.anchor.jsonPath,
      start: state.anchor.start,
      end: state.anchor.end,
    }
  }
  if (state.kind === 'ask_ai_existing' && state.anchor) {
    return {
      jsonPath: state.anchor.jsonPath,
      start: state.anchor.start,
      end: state.anchor.end,
    }
  }
  return null
}

function annotationIdOverrideFor(state: OverlayState): string | undefined {
  if (state.kind === 'ask_ai_existing') return state.annotationId
  return undefined
}

/**
 * Ask AI chat surface. Renders as a right-side drawer at lg+ and as a
 * bottom drawer with drag-to-dismiss + drag handle on mobile.
 *
 * Two open states:
 *  - `ask_ai_anchored`: selection-spawned chat; renders the anchor quote and
 *    mints a new briefing chat against the anchor.
 *  - `ask_ai_existing`: reopening an existing chat annotation; skips create
 *    and loads prior messages directly.
 *
 * Top-of-page Ask AI uses `AskAiPopover` anchored to its button — not this
 * drawer.
 */
export default function AskAiSheet({
  sheet,
  meetingDate,
  onClose,
  onChatCreated,
}: Props): React.JSX.Element {
  const open = isAskAiSheetState(sheet)
  const quote = quoteFor(sheet)
  const anchor = useMemo(() => anchorFor(sheet), [sheet])
  const annotationIdOverride = annotationIdOverrideFor(sheet)
  const isDesktop = !useIsMobile()
  const direction = isDesktop ? 'right' : 'bottom'

  // Clear the user's text selection once the drawer opens. The anchor is
  // already captured in state; leaving the selection live blocks Vaul's
  // drag-to-dismiss (vaul refuses to drag while text is selected).
  useClearSelectionOnOpen(open)

  const handleChatCreated = useCallback(
    (info: { annotationId: string; conversationId: string }) => {
      onChatCreated?.({ ...info, anchor })
    },
    [anchor, onChatCreated],
  )

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => (v ? null : onClose())}
      direction={direction}
    >
      <DrawerContent className="font-opensans flex flex-col gap-0 p-0 lg:max-w-[480px]">
        <DrawerHeader className="gap-2 px-6 pb-4 pr-12 pt-6">
          <DrawerTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Ask AI
          </DrawerTitle>
          {quote ? (
            <blockquote className="border-l-2 border-border pl-3 text-sm italic leading-6 text-muted-foreground">
              {quote}
            </blockquote>
          ) : null}
        </DrawerHeader>

        <div
          data-vaul-no-drag
          className="flex min-h-0 flex-1 flex-col gap-0 px-0 pb-0"
        >
          <AskAiChatBody
            meetingDate={meetingDate}
            anchor={anchor}
            annotationIdOverride={annotationIdOverride}
            showInlineHeader={false}
            bodyClassName="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-3"
            composerVariant="block"
            active={open}
            onChatCreated={onChatCreated ? handleChatCreated : undefined}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
