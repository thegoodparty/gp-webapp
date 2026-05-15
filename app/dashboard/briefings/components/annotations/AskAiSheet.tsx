'use client'

import { useCallback, useMemo } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@styleguide'
import type { AnnotationAnchor } from '@shared/briefings/types'
import type { OverlayState } from './AnnotationsScope'
import AskAiChatBody from './AskAiChatBody'

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
 * Right-side Sheet for the Ask AI chat surface.
 *
 * Two open states:
 *  - `ask_ai_anchored`: selection-spawned chat; renders the anchor quote and
 *    mints a new briefing chat against the anchor.
 *  - `ask_ai_existing`: reopening an existing chat annotation; skips create
 *    and loads prior messages directly.
 *
 * Top-of-page Ask AI uses `AskAiPopover` anchored to its button — not this
 * Sheet.
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

  const handleChatCreated = useCallback(
    (info: { annotationId: string; conversationId: string }) => {
      onChatCreated?.({ ...info, anchor })
    },
    [anchor, onChatCreated],
  )

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <SheetContent
        side="right"
        onPointerDownOutside={() => onClose()}
        onEscapeKeyDown={() => onClose()}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]"
      >
        <SheetHeader className="gap-2 px-6 pb-4 pr-12 pt-6">
          <SheetTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Ask AI
          </SheetTitle>
          {quote ? (
            <p className="text-sm italic text-muted-foreground">
              &ldquo;{quote}&rdquo;
            </p>
          ) : null}
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-0 px-0 pb-0">
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
      </SheetContent>
    </Sheet>
  )
}
