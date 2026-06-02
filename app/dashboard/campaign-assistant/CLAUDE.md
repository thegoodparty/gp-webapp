# app/dashboard/campaign-assistant/

AI campaign assistant chat. Threaded conversations with an LLM that has campaign context (positions, audience, content). Note: the dir is `campaign-assistant/` even though the tech design refers to it as "campaign-tools."

## Key files

| File | Role |
|------|------|
| `page.tsx` | Route entry |
| `components/CampaignAssistantPage.tsx` | Top-level layout — sidebar (history) + main chat panel |
| `components/Chat.tsx` | The active conversation — message list + composer |
| `components/ChatProvider.tsx` + `useChat.ts` | Feature context — current thread, send/stream actions |
| `components/ChatInput.tsx` | Composer (text + attachments) |
| `components/ChatMessage.tsx` | Message rendering (user, assistant, system) |
| `components/ChatHistory*.tsx` | Sidebar — grouped past threads |
| `components/ChatFeedback.tsx` | 👍 / 👎 / written feedback per assistant turn |
| `components/ChatError.tsx` | Inline error banner with retry/dismiss for failed streams |
| `components/ajaxActions.ts` | gp-api calls — `streamChat` (SSE), fetch history, post feedback |

## Patterns

- **`ChatProvider` owns the thread**. Components read messages and call `handleNewInput` / `handleRegenerate` / `retryLast` / `stopStream` via context (`useChat`), not props.
- **Streaming** uses SSE. `streamChat()` in `components/ajaxActions.ts` raw-`fetch`es `POST /campaigns/ai/chat/stream` (so the body isn't buffered) and yields typed `ChatStreamEvent`s (`text` / `done` / `error`). `ChatProvider.runStream` accumulates `text` deltas into `streamingContent` (rendered as a live assistant bubble in `Chat.tsx`), commits the final message on `done`, and surfaces `error` (with retry) via `components/ChatError.tsx`. The same endpoint serves first message, follow-ups, and regenerate.
- **Stop generating**: `runStream` holds an `AbortController`; `stopStream()` aborts it (the server emits an ignored `aborted` event and the partial text is committed locally). `ChatInput.tsx` swaps the send button for a stop button while `loading`.
- **Stick-to-bottom autoscroll**: `ChatProvider` tracks `stickToBottomRef` via the thread's `onThreadScroll`; live token streaming only auto-scrolls when the user is already near the bottom. A new send re-pins to bottom.
- **Copy**: `ChatMessage` copies the *rendered* message as rich `text/html` + `text/plain` (via the Clipboard API) so pasted output keeps formatting/links instead of raw markdown; falls back to `writeText`.
- **Markdown rendering**: assistant content is GFM Markdown (backend appends a markdown directive overriding the CMS HTML prompt). `ChatMessage` renders via `react-markdown` + `remark-gfm`, with a fallback branch that sanitizes + renders any legacy HTML-stored messages.
- **History grouping** (Today / Yesterday / This week / older) is computed in `components/ChatHistoryGroup.tsx` from message timestamps.
- Feedback (`components/ChatFeedback.tsx`) writes to a separate gp-api endpoint — it's not part of the message itself.

## Gotchas

- This is the dashboard chat. The candidate-facing public chat (if any) lives elsewhere — don't reuse `ChatProvider` outside this dir without checking.
- `components/ajaxActions.ts` is feature-local and mixes typed + legacy fetchers — port to typed (`clientRequest`) when touching, see `gpApi/CLAUDE.md`.
- Long histories are paginated server-side — don't load all threads at once when adding new history features.

## Related

- `gpApi/api-endpoints.ts` — chat endpoints.
- `app/shared/experiments/` — gating for assistant features behind feature flags.
