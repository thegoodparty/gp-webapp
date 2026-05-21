'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, Search, Send, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, IconButton, Input, Textarea } from '@styleguide'
import { chatApi } from '@shared/briefings/chat-api'
import { reportErrorToSentry } from '@shared/sentry'
import type { AnnotationAnchor, ChatMessage } from '@shared/briefings/types'
import type {
  ChatErrorCode,
  ChatStreamEvent,
} from '@shared/briefings/chat-events'
import AskAiSuggestedPills from './AskAiSuggestedPills'

type Props = {
  meetingDate: string
  anchor: AnnotationAnchor | null
  /**
   * When set, the body skips `createBriefingChat` and uses this annotation
   * id to load prior messages directly. Use when reopening an existing
   * chat-kind annotation.
   */
  annotationIdOverride?: string
  /**
   * When true, renders the inline "Briefing assistant" header in the empty
   * state. Sheet container renders its own SheetHeader and sets this false.
   */
  showInlineHeader?: boolean
  /**
   * Cap the scrollable conversation height. Popover uses a constrained
   * `max-h`; Sheet expands to fill remaining vertical space.
   */
  bodyClassName?: string
  /**
   * Active state — when the parent surface closes, set this to false. The
   * body uses it to abort any in-flight stream. Defaults to true.
   */
  active?: boolean
  /**
   * Fires once after `POST /v1/briefing-chats` succeeds with the real
   * annotation + conversation ids. The Sheet wires this to mirror-write
   * the chat into the localStorage annotations stub so the highlight
   * layer renders it before the real GET /v1/annotations endpoint exists.
   */
  onChatCreated?: (info: {
    annotationId: string
    conversationId: string
  }) => void
  /**
   * Composer layout. `inline` (default) renders a single-line Input with a
   * send IconButton for the popover. `block` renders a Textarea above an
   * "Ask AI" Button, matching the notes/report sheet pattern. Sheet uses
   * `block`; popover keeps `inline`.
   */
  composerVariant?: 'inline' | 'block'
}

type StreamingMessage = {
  role: 'assistant'
  content: string
  id?: string
}

type ErrorState = {
  message: string
  retryable: boolean
  lastUserContent: string
  lastClientMessageId: string
  /**
   * Optional kind tag used for retry routing. `init` means the chat
   * never finished creating — the Retry button should re-run `initialize`
   * instead of replaying a user turn.
   */
  kind?: 'init' | 'stream'
}

const FRIENDLY_ERROR_COPY: Record<ChatErrorCode, string> = {
  rate_limited: 'Too many requests. Try again in a moment.',
  upstream_unavailable: 'Chat is temporarily unavailable. Try again.',
  aborted: '',
  conversation_not_found:
    'This chat is no longer available. Try starting a new one.',
  internal: 'Something went wrong. Try again.',
}

function friendlyErrorMessage(code: ChatErrorCode): string {
  return FRIENDLY_ERROR_COPY[code] ?? 'Something went wrong. Try again.'
}

type ChatItem =
  | { kind: 'user'; id: string; content: string }
  | { kind: 'assistant'; id: string; content: string; toolsUsed?: string[] }
  | { kind: 'interrupted'; id: string }

// Mirrors CHAT_INTERRUPTED_BEFORE_OUTPUT_MARKER in gp-api's
// chats/services/chatStream.service.ts. Server persists this exact
// string as the assistant content when a stream was aborted before any
// text was produced.
const CHAT_INTERRUPTED_BEFORE_OUTPUT_MARKER =
  '__chat:interrupted_before_output__'

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  web_search: 'Searching the web',
  get_artifacts: 'Searching the briefing',
  district_insights: 'Searching GoodParty data',
  list_district_topics: 'Searching GoodParty data',
  get_my_notes: 'Reading your notes',
}

function toolDisplayName(toolName: string): string {
  return TOOL_DISPLAY_NAMES[toolName] ?? toolName
}

function newClientMessageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `cmid_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

function emptyAnchor(): AnnotationAnchor {
  return { jsonPath: null, start: null, end: null }
}

function messageToItem(msg: ChatMessage): ChatItem | null {
  if (msg.role === 'user') {
    return { kind: 'user', id: msg.id, content: msg.content }
  }
  if (msg.role === 'assistant') {
    if (msg.content === CHAT_INTERRUPTED_BEFORE_OUTPUT_MARKER) {
      return { kind: 'interrupted', id: msg.id }
    }
    return { kind: 'assistant', id: msg.id, content: msg.content }
  }
  return null
}

/**
 * Shared chat body — message list, composer, suggested pills, streaming
 * logic. Rendered inside `AskAiSheet` (the right-side drawer on desktop,
 * bottom drawer on mobile) for all three Ask AI entry points: top-level,
 * anchored selection, and reopening an existing chat annotation.
 *
 * Lifecycle:
 *  1. On mount, mint a briefing chat (annotationId + conversationId) unless
 *     `annotationIdOverride` is provided, then load prior messages.
 *  2. Empty state shows the three suggested pills + composer.
 *  3. Sending streams text deltas progressively. Errors render inline with a
 *     Retry button if the error is retryable.
 *  4. When `active` flips to false, abort the in-flight stream.
 */
export default function AskAiChatBody({
  meetingDate,
  anchor,
  annotationIdOverride,
  showInlineHeader = true,
  bodyClassName,
  active = true,
  onChatCreated,
  composerVariant = 'inline',
}: Props): React.JSX.Element {
  const [annotationId, setAnnotationId] = useState<string | null>(null)
  const [history, setHistory] = useState<ChatItem[]>([])
  const [streaming, setStreaming] = useState<StreamingMessage | null>(null)
  const [composer, setComposer] = useState('')
  const [error, setError] = useState<ErrorState | null>(null)
  const [creating, setCreating] = useState(false)
  const [sending, setSending] = useState(false)
  const [activeTools, setActiveTools] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const initRequestedRef = useRef(false)
  const sendingRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const wasAtBottomRef = useRef(true)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const initialize = useCallback(async () => {
    if (initRequestedRef.current) return
    initRequestedRef.current = true
    setCreating(true)
    try {
      let activeId = annotationIdOverride ?? null
      if (!activeId) {
        const created = await chatApi.createBriefingChat({
          meetingDate,
          anchor: anchor ?? emptyAnchor(),
        })
        activeId = created.annotationId
        onChatCreated?.({
          annotationId: created.annotationId,
          conversationId: created.conversationId,
        })
      }
      setAnnotationId(activeId)
      const msgs = await chatApi.listMessages(activeId)
      const items: ChatItem[] = []
      for (const m of msgs) {
        const it = messageToItem(m)
        if (it) items.push(it)
      }
      setHistory(items)
    } catch (err) {
      reportErrorToSentry(err, {
        surface: 'briefing-ask-ai',
        phase: 'init',
        meetingDate,
        annotationIdOverride,
      })
      initRequestedRef.current = false
      setError({
        message: 'Could not start chat. Try again.',
        retryable: true,
        lastUserContent: '',
        lastClientMessageId: '',
        kind: 'init',
      })
    } finally {
      setCreating(false)
    }
  }, [anchor, annotationIdOverride, meetingDate, onChatCreated])

  useEffect(() => {
    if (active && !initRequestedRef.current) {
      void initialize()
    }
  }, [active, initialize])

  // Abort any in-flight stream when the surface closes. State reset is
  // unnecessary — AskAiSheet is conditionally mounted in AnnotationsScope,
  // so the next open gets fresh state from a fresh mount.
  useEffect(() => {
    if (active) return
    const ctrl = abortRef.current
    if (ctrl && !ctrl.signal.aborted) {
      ctrl.abort()
    }
    abortRef.current = null
    sendingRef.current = false
    setSending(false)
  }, [active])

  // Abort on unmount as a safety net.
  useEffect(() => {
    return () => {
      const ctrl = abortRef.current
      if (ctrl && !ctrl.signal.aborted) {
        ctrl.abort()
      }
      abortRef.current = null
    }
  }, [])

  // Track whether the user is at (or near) the bottom of the conversation
  // so we know whether to follow streaming text. Once they scroll up to
  // read earlier content, we stop yanking them back down.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      const atBottom = distance < 80
      wasAtBottomRef.current = atBottom
      setIsAtBottom(atBottom)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Follow streaming output and new messages, but only when the user is
  // already pinned to the bottom. Also re-evaluate isAtBottom so the
  // "new text below" pill flips on the moment content grows past view.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (wasAtBottomRef.current) {
      el.scrollTop = el.scrollHeight
    } else {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight
      setIsAtBottom(distance < 80)
    }
  }, [streaming?.content, history.length])

  const jumpToBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
    wasAtBottomRef.current = true
    setIsAtBottom(true)
  }, [])

  // Keep the "new text below" pill visible for a moment after the stream
  // ends so the user has time to notice and click — otherwise the pill
  // vanishes the instant the last token lands.
  const [pillLingering, setPillLingering] = useState(false)
  useEffect(() => {
    const active = sending || streaming !== null
    if (active) {
      setPillLingering(true)
      return
    }
    if (!pillLingering) return
    const t = setTimeout(() => setPillLingering(false), 3000)
    return () => clearTimeout(t)
  }, [sending, streaming, pillLingering])

  const runStream = useCallback(
    async (
      targetAnnotationId: string,
      content: string,
      clientMessageId: string,
    ) => {
      const controller = new AbortController()
      abortRef.current = controller
      sendingRef.current = true
      setSending(true)
      setStreaming({ role: 'assistant', content: '' })
      setActiveTools([])
      setError(null)

      try {
        const iter = chatApi.streamMessage({
          annotationId: targetAnnotationId,
          content,
          clientMessageId,
          signal: controller.signal,
        })
        let assembled = ''
        let assistantId: string | undefined
        let errored: ChatStreamEvent | null = null
        const turnTools: string[] = []

        for await (const ev of iter) {
          if (ev.type === 'text') {
            assembled += ev.delta
            setStreaming({ role: 'assistant', content: assembled })
          } else if (ev.type === 'tool_call') {
            if (!turnTools.includes(ev.toolName)) {
              turnTools.push(ev.toolName)
              setActiveTools([...turnTools])
            }
          } else if (ev.type === 'done') {
            assistantId = ev.assistantMessageId
            break
          } else if (ev.type === 'error') {
            errored = ev
            break
          }
        }

        if (errored && errored.type === 'error') {
          if (errored.code === 'aborted') {
            setStreaming(null)
          } else {
            setError({
              message: friendlyErrorMessage(errored.code),
              retryable: errored.retryable,
              lastUserContent: content,
              lastClientMessageId: clientMessageId,
              kind: 'stream',
            })
            setStreaming(null)
          }
        } else {
          setHistory((prev) => [
            ...prev,
            {
              kind: 'assistant',
              id: assistantId ?? `local_${clientMessageId}`,
              content: assembled,
              ...(turnTools.length > 0 && { toolsUsed: [...turnTools] }),
            },
          ])
          setStreaming(null)
        }
      } catch (err) {
        reportErrorToSentry(err, {
          surface: 'briefing-ask-ai',
          phase: 'stream',
          meetingDate,
          annotationId: targetAnnotationId,
        })
        setError({
          message: 'Stream interrupted. Try again.',
          retryable: true,
          lastUserContent: content,
          lastClientMessageId: clientMessageId,
          kind: 'stream',
        })
        setStreaming(null)
      } finally {
        sendingRef.current = false
        setSending(false)
        setActiveTools([])
        abortRef.current = null
      }
    },
    [meetingDate],
  )

  const sendContent = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return false
      if (!annotationId) return false
      if (sendingRef.current) return false
      sendingRef.current = true
      const clientMessageId = newClientMessageId()
      setHistory((prev) => [
        ...prev,
        { kind: 'user', id: `local_${clientMessageId}`, content: trimmed },
      ])
      await runStream(annotationId, trimmed, clientMessageId)
      return true
    },
    [annotationId, runStream],
  )

  const onSend = useCallback(async () => {
    const content = composer
    const sent = await sendContent(content)
    if (sent) setComposer('')
  }, [composer, sendContent])

  const onRetry = useCallback(async () => {
    if (!error) return
    if (error.kind === 'init') {
      setError(null)
      initRequestedRef.current = false
      await initialize()
      return
    }
    if (!annotationId) return
    const { lastUserContent, lastClientMessageId } = error
    if (!lastUserContent || !lastClientMessageId) return
    await runStream(annotationId, lastUserContent, lastClientMessageId)
  }, [annotationId, error, initialize, runStream])

  const onRetryInterrupted = useCallback(
    async (interruptedId: string) => {
      if (!annotationId || sending) return
      const idx = history.findIndex((it) => it.id === interruptedId)
      if (idx <= 0) return
      const prior = history[idx - 1]
      if (!prior || prior.kind !== 'user') return
      setHistory((prev) => prev.filter((it) => it.id !== interruptedId))
      const clientMessageId = newClientMessageId()
      await runStream(annotationId, prior.content, clientMessageId)
    },
    [annotationId, history, runStream, sending],
  )

  const onRetryLastUser = useCallback(async () => {
    if (!annotationId || sending) return
    for (let i = history.length - 1; i >= 0; i--) {
      const it = history[i]
      if (it && it.kind === 'user') {
        const clientMessageId = newClientMessageId()
        await runStream(annotationId, it.content, clientMessageId)
        return
      }
    }
  }, [annotationId, history, runStream, sending])

  const onSelectSuggestion = useCallback(
    (suggestion: string) => {
      void sendContent(suggestion)
    },
    [sendContent],
  )

  const onComposerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void onSend()
      }
    },
    [onSend],
  )

  // Drop stale interrupted markers — only keep one if it's the last
  // item, since a retry that produced any successor message supersedes it.
  const displayedHistory = history.filter(
    (it, i) => it.kind !== 'interrupted' || i === history.length - 1,
  )

  // Cover the legacy / no-sentinel case too: if the last message is a
  // bare user message and the stream is idle, surface the same Retry
  // affordance. Conversations from before the server's sentinel-persist
  // landed (and any future ones where persist itself failed) end up here.
  const lastItem = displayedHistory[displayedHistory.length - 1]
  const showBareUserRetry =
    !streaming &&
    !sending &&
    !creating &&
    !error &&
    annotationId !== null &&
    lastItem?.kind === 'user'

  const showEmptyState =
    !creating && displayedHistory.length === 0 && !streaming && !error

  const showJumpPill = !isAtBottom && pillLingering

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          className={
            bodyClassName ??
            'flex max-h-[60vh] min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3'
          }
          data-testid="ask-ai-conversation"
        >
          {creating && (
            <div className="text-sm text-muted-foreground">Loading chat...</div>
          )}

          {showEmptyState && (
            <div className="flex flex-col gap-3">
              {showInlineHeader && (
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="size-4" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold">
                    Briefing assistant
                  </span>
                </div>
              )}
              <p className="text-sm leading-5 text-muted-foreground">
                Ask anything about this briefing — I can summarize sections,
                compare options, or pull out the asks.
              </p>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Suggested
                </span>
                <AskAiSuggestedPills
                  onSelect={onSelectSuggestion}
                  disabled={sending}
                />
              </div>
            </div>
          )}

          {displayedHistory.map((item) => {
            if (item.kind === 'interrupted') {
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-start gap-2 self-start rounded-2xl border border-dashed border-base-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
                >
                  <span>Something went wrong.</span>
                  <Button
                    type="button"
                    size="small"
                    variant="outline"
                    onClick={() => void onRetryInterrupted(item.id)}
                    disabled={sending}
                  >
                    Retry
                  </Button>
                </div>
              )
            }
            if (item.kind === 'user') {
              return (
                <div
                  key={item.id}
                  className="self-end rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                >
                  {item.content}
                </div>
              )
            }
            return (
              <div
                key={item.id}
                className="self-start max-w-full rounded-2xl bg-muted px-3 py-2 text-sm text-foreground space-y-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_p]:!block [&_p]:!flex-none [&_p]:!whitespace-normal [&_strong]:!inline [&_strong]:font-semibold [&_em]:!inline [&_em]:italic [&_a]:!inline [&_a]:underline [&_code]:!inline [&_code]:rounded [&_code]:bg-foreground/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_li]:!list-item [&_li]:my-0 [&_ul]:!block [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:!block [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_h1]:!block [&_h1]:text-base [&_h1]:font-semibold [&_h2]:!block [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:!block [&_h3]:text-sm [&_h3]:font-semibold [&_table]:!table [&_table]:!w-full [&_table]:!border-collapse [&_table]:my-2 [&_thead]:!table-header-group [&_tbody]:!table-row-group [&_tr]:!table-row [&_tr]:!border-b [&_tr]:border-foreground/15 [&_th]:!table-cell [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold [&_th]:!border-b-2 [&_th]:!border-foreground/30 [&_td]:!table-cell [&_td]:px-2 [&_td]:py-1.5 [&_td]:align-top"
              >
                {item.toolsUsed && item.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.toolsUsed.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        <Search className="size-3" aria-hidden />
                        {toolDisplayName(t)}
                      </span>
                    ))}
                  </div>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.content}
                </ReactMarkdown>
              </div>
            )
          })}

          {showBareUserRetry && (
            <div className="flex flex-col items-start gap-2 self-start rounded-2xl border border-dashed border-base-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <span>Something went wrong.</span>
              <Button
                type="button"
                size="small"
                variant="outline"
                onClick={() => void onRetryLastUser()}
                disabled={sending}
              >
                Retry
              </Button>
            </div>
          )}

          {streaming && (
            <div className="self-start max-w-full rounded-2xl bg-muted px-3 py-2 text-sm text-foreground space-y-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_li]:my-0 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_code]:rounded [&_code]:bg-foreground/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_a]:underline">
              {activeTools.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeTools.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      <Search className="size-3" aria-hidden />
                      {toolDisplayName(t)}
                    </span>
                  ))}
                </div>
              )}
              {streaming.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streaming.content}
                </ReactMarkdown>
              ) : activeTools.length === 0 ? (
                <span className="text-muted-foreground">Thinking...</span>
              ) : null}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex flex-col gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <span>{error.message}</span>
              {error.retryable && (
                <Button
                  type="button"
                  size="small"
                  variant="outline"
                  onClick={onRetry}
                  disabled={sending}
                >
                  Retry
                </Button>
              )}
            </div>
          )}
        </div>

        {showJumpPill && (
          <button
            type="button"
            onClick={jumpToBottom}
            aria-label="Jump to latest message"
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground/85 px-3 py-1.5 text-xs font-medium text-background shadow-md backdrop-blur transition-colors hover:bg-foreground"
          >
            <ArrowDown className="size-3.5" aria-hidden />
            <span>New text below</span>
          </button>
        )}
      </div>

      {composerVariant === 'block' ? (
        <div className="flex flex-col gap-3 border-t border-base-border bg-background px-4 py-4">
          <Textarea
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            placeholder="Ask a question and the AI answers"
            disabled={sending || creating || !annotationId}
            rows={3}
            className="min-h-[96px] resize-none rounded-2xl"
            aria-label="Ask AI message"
          />
          <Button
            type="button"
            onClick={() => {
              void onSend()
            }}
            disabled={!annotationId || composer.trim().length === 0}
            loading={sending || creating}
            icon={<Send className="size-4" aria-hidden />}
            iconPosition="left"
            className="w-full"
          >
            Ask AI
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 border-t border-base-border px-3 py-3">
          <Input
            ref={inputRef}
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            onKeyDown={onComposerKeyDown}
            placeholder="Ask anything about this briefing..."
            disabled={sending || creating || !annotationId}
            aria-label="Ask AI message"
          />
          <IconButton
            type="button"
            size="large"
            aria-label="Send"
            className="aspect-square shrink-0"
            onClick={() => {
              void onSend()
            }}
            disabled={!annotationId || composer.trim().length === 0}
            loading={sending || creating}
          >
            <Send className="size-4" aria-hidden />
          </IconButton>
        </div>
      )}
    </div>
  )
}
