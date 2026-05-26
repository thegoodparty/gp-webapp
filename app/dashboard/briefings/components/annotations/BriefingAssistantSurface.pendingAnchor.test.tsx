import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import type { Annotation } from '@shared/briefings/types'
import { BriefingAssistantSurface } from './BriefingAssistantSurface'

vi.mock('./AskAiChatBody', () => ({
  __esModule: true,
  default: vi.fn(
    ({
      annotationIdOverride,
      active,
      anchor,
    }: {
      annotationIdOverride?: string
      active?: boolean
      anchor?: { jsonPath: string | null }
    }) => (
      <div
        data-testid="chat-body"
        data-annotation-id={annotationIdOverride ?? 'none'}
        data-active={String(active)}
        data-json-path={String(anchor?.jsonPath ?? 'null')}
      />
    ),
  ),
}))

function pageLevelChat(overrides: Partial<Annotation> = {}): Annotation {
  return {
    id: 'ann_page',
    kind: 'chat',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: null,
    start: null,
    end: null,
    createdAt: '2026-05-14T00:00:00.000Z',
    updatedAt: '2026-05-14T00:00:00.000Z',
    chat: { id: 'chat_1', createdAt: '2026-05-14T00:00:00.000Z' },
    ...overrides,
  }
}

describe('<BriefingAssistantSurface> — pendingAnchor takes precedence', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('preempts the cycler with a fresh anchored composer when pendingAnchor is set, even if other chats exist', () => {
    render(
      <BriefingAssistantSurface
        open
        onClose={vi.fn()}
        meetingDate="2026-05-14"
        annotations={[pageLevelChat()]}
        pendingAnchor={{
          jsonPath: '/items/3/title',
          start: 0,
          end: 5,
        }}
      />,
    )

    const body = screen.getByTestId('chat-body')
    // The composer must use the selection's anchor, not fall back to the
    // existing page-level chat at position 1 of N.
    expect(body.getAttribute('data-json-path')).toBe('/items/3/title')
    // No annotationIdOverride — this is a NEW chat that hasn't been minted
    // yet. The existing page-level chat (ann_page) must NOT be focused.
    expect(body.getAttribute('data-annotation-id')).toBe('none')
  })

  it('still preempts when pendingAnchor is set and annotations is empty', () => {
    render(
      <BriefingAssistantSurface
        open
        onClose={vi.fn()}
        meetingDate="2026-05-14"
        annotations={[]}
        pendingAnchor={{
          jsonPath: '/items/3/title',
          start: 0,
          end: 5,
        }}
      />,
    )

    const body = screen.getByTestId('chat-body')
    expect(body.getAttribute('data-json-path')).toBe('/items/3/title')
    expect(body.getAttribute('data-annotation-id')).toBe('none')
  })

  it('falls back to the cycler view when pendingAnchor is undefined and chats exist', () => {
    render(
      <BriefingAssistantSurface
        open
        onClose={vi.fn()}
        meetingDate="2026-05-14"
        annotations={[pageLevelChat()]}
      />,
    )

    // Without a pendingAnchor, the existing page-level chat at position 1
    // is the one rendered — the cycler is in normal view mode.
    const body = screen.getByTestId('chat-body')
    expect(body.getAttribute('data-annotation-id')).toBe('ann_page')
    expect(body.getAttribute('data-json-path')).toBe('null')
  })
})
