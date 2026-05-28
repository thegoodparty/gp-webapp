'use client'

import { useEffect, useState } from 'react'
import type {
  Annotation,
  AnnotationAnchor,
  Item,
} from '@shared/briefings/types'
import { EMPTY_ANCHOR, isPageWideChat } from '@shared/briefings/anchorResolver'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import AskAiChatBody from './AskAiChatBody'
import { AnnotationSurfaceSheet } from './AnnotationSurfaceSheet'
import type { EnrichedAnnotation } from './enrichForCycler'
import { AnchoredQuote } from './AnchoredQuote'
import { DeleteAnnotationButton } from './DeleteAnnotationButton'
import { useEnrichedAnnotations } from './useEnrichedAnnotations'
import { sectionLabelFromPath } from './sectionLabel'

interface Props {
  open: boolean
  onClose: () => void
  meetingDate: string
  /**
   * Agenda items used to resolve the section title that sits above the
   * anchored quote (e.g. "EXECUTIVE SUMMARY"). Optional — when absent the
   * quote renders without a section label.
   */
  briefingItems?: readonly Item[]
  annotations: Annotation[]
  initialAnnotationId?: string
  /**
   * Pre-loaded anchor from a text selection. When set, the empty-state
   * composer mints a new anchored chat against this anchor instead of a
   * page-level chat. Used when the user clicks "Ask AI" on a live
   * selection.
   */
  pendingAnchor?: AnnotationAnchor
  /**
   * Forwarded to AskAiChatBody so the annotations React Query cache
   * gets invalidated when the empty-state composer mints a new chat.
   * Otherwise the cycler stays in empty state and the new chat doesn't
   * appear until an unrelated refetch.
   */
  onChatCreated?: (info: {
    annotationId: string
    conversationId: string
  }) => void
  onDeleteChat: (annotation: Annotation) => Promise<void>
}

function anchorFromAnnotation(item: EnrichedAnnotation): AnnotationAnchor {
  if (item.jsonPath === null || item.start === null || item.end === null) {
    return EMPTY_ANCHOR
  }
  return { jsonPath: item.jsonPath, start: item.start, end: item.end }
}

function ChatBody({
  item,
  meetingDate,
  active,
  onSendingChange,
  briefingItems,
}: {
  item: EnrichedAnnotation
  meetingDate: string
  active: boolean
  onSendingChange: (sending: boolean) => void
  briefingItems?: readonly Item[]
}) {
  const sectionLabel = sectionLabelFromPath(item.jsonPath, briefingItems)
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {item.highlightedText && item.jsonPath !== null ? (
        <AnchoredQuote
          text={item.highlightedText}
          variant="primary"
          showLabel={sectionLabel !== null}
          label={sectionLabel ?? undefined}
        />
      ) : null}
      <AskAiChatBody
        meetingDate={meetingDate}
        anchor={anchorFromAnnotation(item)}
        annotationIdOverride={item.id}
        showInlineHeader={false}
        bodyClassName="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
        composerVariant="block"
        active={active}
        onSendingChange={onSendingChange}
      />
    </div>
  )
}

export function BriefingAssistantSurface({
  open,
  onClose,
  meetingDate,
  briefingItems,
  annotations,
  initialAnnotationId,
  pendingAnchor,
  onChatCreated,
  onDeleteChat,
}: Props) {
  const isMobile = useIsMobile()
  const items = useEnrichedAnnotations(open, annotations, 'chat')
  // When the user is mid-selection-to-anchored-chat, preempt the cycler with
  // the empty-state composer carrying the live anchor. Otherwise the cycler
  // would land on whichever existing chat sorts to position 1 (typically the
  // unanchored page-level chat) and the user's selection would be silently
  // dropped.
  const itemsForCycler = pendingAnchor ? [] : items
  // Mid-stream guard for delete. AskAiChatBody fires onSendingChange when
  // its `sending || creating` flips; while true, the Delete chat button is
  // disabled so the user can't pull the annotation out from under an
  // in-flight stream / chat-create request.
  const [isStreaming, setIsStreaming] = useState(false)
  // Track the freshly-minted chat id while we're still in pending-anchor
  // (empty-state) mode. The empty-state `AskAiChatBody` fires
  // `onAnnotationIdReady` the moment `createBriefingChat` resolves —
  // which happens BEFORE the overlay swap (we defer `onChatCreated`
  // until stream success to avoid mid-stream unmount). Without this,
  // the Delete chat button only appears after the swap; users have
  // observed the swap failing to fire reliably in production, so this
  // also provides a fallback path: even if the swap never lands, the
  // delete affordance is wired off the minted id directly.
  const [emptyStateMintedId, setEmptyStateMintedId] = useState<string | null>(
    null,
  )
  // Reset when the sheet closes or the overlay swaps away from the
  // pending-anchor preempt — at that point the cycler-driven `current`
  // takes over as the delete target.
  useEffect(() => {
    if (!pendingAnchor && emptyStateMintedId !== null) {
      setEmptyStateMintedId(null)
    }
  }, [pendingAnchor, emptyStateMintedId])
  // Synthesize a minimal annotation for the footer to render Delete
  // chat against while the cycler still has empty items. We have the
  // id (from the AskAiChatBody callback) and the anchor (from
  // pendingAnchor); the other fields aren't read by DeleteAnnotation-
  // Button or isPageWideChat, but typing them avoids a wider relaxation
  // of the prop type. The button is disabled via `isStreaming` until
  // the stream completes — see footer below.
  const mintedAnnotation: EnrichedAnnotation | null =
    emptyStateMintedId && pendingAnchor
      ? {
          id: emptyStateMintedId,
          kind: 'chat',
          resourceType: 'briefing',
          resourceId: '',
          authorUserId: 0,
          jsonPath: pendingAnchor.jsonPath,
          start: pendingAnchor.start,
          end: pendingAnchor.end,
          createdAt: '',
          updatedAt: '',
          docOrderIndex: 0,
          highlightedText: null,
        }
      : null
  return (
    <AnnotationSurfaceSheet
      open={open}
      onClose={onClose}
      title={isMobile ? null : 'Assistant highlight'}
      accessibleTitle="Briefing assistant"
      subtitle="Ask anything about this section, or highlight some text to ask or get help about just that text."
      positionLabel="Chat"
      items={itemsForCycler}
      renderItem={(item) => (
        <ChatBody
          item={item}
          meetingDate={meetingDate}
          active={open}
          onSendingChange={setIsStreaming}
          briefingItems={briefingItems}
        />
      )}
      footer={(current) => {
        // Prefer the cycler's `current` once it lands; fall back to the
        // synthetic minted annotation while we're still in pending-
        // anchor empty-state mode (overlay swap hasn't happened yet,
        // but the row exists on the server).
        const target = current ?? mintedAnnotation
        // Hide Delete chat for the page-wide (unanchored) AI chat — that
        // conversation is the briefing's primary assistant thread and
        // deleting it from the cycler would lose context with no recovery
        // path. Anchored chats remain deletable.
        return target && !isPageWideChat(target) ? (
          <DeleteAnnotationButton
            current={target}
            label="Delete chat"
            title="Delete this chat?"
            description="The conversation and all its messages will be permanently removed. You can't undo this."
            onDelete={onDeleteChat}
            disabled={isStreaming}
          />
        ) : null
      }}
      emptyState={
        <AskAiChatBody
          meetingDate={meetingDate}
          anchor={pendingAnchor ?? EMPTY_ANCHOR}
          showInlineHeader={false}
          bodyClassName="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
          composerVariant="block"
          active={open}
          onChatCreated={onChatCreated}
          onAnnotationIdReady={setEmptyStateMintedId}
          // Wire isStreaming for the empty-state body too — when the
          // user fires the first send the row exists (Delete chat is
          // visible) but the stream is still in flight; the button must
          // stay disabled until the conversation is durable.
          onSendingChange={setIsStreaming}
        />
      }
      initialAnnotationId={initialAnnotationId}
    />
  )
}
