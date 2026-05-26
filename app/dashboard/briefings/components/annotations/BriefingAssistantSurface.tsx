'use client'

import type { Annotation, AnnotationAnchor } from '@shared/briefings/types'
import { EMPTY_ANCHOR } from '@shared/briefings/anchorResolver'
import AskAiChatBody from './AskAiChatBody'
import { AnnotationSurfaceSheet } from './AnnotationSurfaceSheet'
import type { EnrichedAnnotation } from './enrichForCycler'
import { AnchoredQuote } from './AnchoredQuote'
import { useEnrichedAnnotations } from './useEnrichedAnnotations'

interface Props {
  open: boolean
  onClose: () => void
  meetingDate: string
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
}: {
  item: EnrichedAnnotation
  meetingDate: string
  active: boolean
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {item.highlightedText && item.jsonPath !== null ? (
        <AnchoredQuote
          text={item.highlightedText}
          variant="primary"
          showLabel={false}
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
      />
    </div>
  )
}

export function BriefingAssistantSurface({
  open,
  onClose,
  meetingDate,
  annotations,
  initialAnnotationId,
  pendingAnchor,
  onChatCreated,
}: Props) {
  const items = useEnrichedAnnotations(open, annotations, 'chat')
  // When the user is mid-selection-to-anchored-chat, preempt the cycler with
  // the empty-state composer carrying the live anchor. Otherwise the cycler
  // would land on whichever existing chat sorts to position 1 (typically the
  // unanchored page-level chat) and the user's selection would be silently
  // dropped.
  const itemsForCycler = pendingAnchor ? [] : items
  return (
    <AnnotationSurfaceSheet
      open={open}
      onClose={onClose}
      title="Briefing assistant"
      positionLabel="Chat"
      items={itemsForCycler}
      renderItem={(item) => (
        <ChatBody item={item} meetingDate={meetingDate} active={open} />
      )}
      emptyState={
        <AskAiChatBody
          meetingDate={meetingDate}
          anchor={pendingAnchor ?? EMPTY_ANCHOR}
          showInlineHeader={false}
          bodyClassName="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
          composerVariant="block"
          active={open}
          onChatCreated={onChatCreated}
        />
      }
      initialAnnotationId={initialAnnotationId}
    />
  )
}
