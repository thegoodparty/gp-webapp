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
| `components/ajaxActions.ts` | gp-api calls — send, fetch history, post feedback |

## Patterns

- **`ChatProvider` owns the thread**. Components read messages and call `send` via context (`useChat`), not props.
- **Streaming** comes back from gp-api; `components/ajaxActions.ts` handles the stream and pushes deltas into the provider.
- **History grouping** (Today / Yesterday / This week / older) is computed in `components/ChatHistoryGroup.tsx` from message timestamps.
- Feedback (`components/ChatFeedback.tsx`) writes to a separate gp-api endpoint — it's not part of the message itself.

## Gotchas

- This is the dashboard chat. The candidate-facing public chat (if any) lives elsewhere — don't reuse `ChatProvider` outside this dir without checking.
- `components/ajaxActions.ts` is feature-local and mixes typed + legacy fetchers — port to typed (`clientRequest`) when touching, see `gpApi/CLAUDE.md`.
- Long histories are paginated server-side — don't load all threads at once when adding new history features.

## Related

- `gpApi/api-endpoints.ts` — chat endpoints.
- `app/shared/experiments/` — gating for assistant features behind feature flags.
