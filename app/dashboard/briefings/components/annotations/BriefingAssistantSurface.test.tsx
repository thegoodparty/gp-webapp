import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import type { Annotation } from '@shared/briefings/types'
import { BriefingAssistantSurface } from './BriefingAssistantSurface'
import { enrichForCycler } from './enrichForCycler'

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

vi.mock('./enrichForCycler', async () => {
  const actual =
    await vi.importActual<typeof import('./enrichForCycler')>(
      './enrichForCycler',
    )
  return {
    ...actual,
    enrichForCycler: vi.fn(actual.enrichForCycler),
  }
})

function anchoredChat(overrides: Partial<Annotation> = {}): Annotation {
  return {
    id: 'ann_anchored',
    kind: 'chat',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: 'agenda.0.title',
    start: 0,
    end: 5,
    createdAt: '2026-05-14T00:00:00.000Z',
    updatedAt: '2026-05-14T00:00:00.000Z',
    chat: { id: 'chat_1', createdAt: '2026-05-14T00:00:00.000Z' },
    ...overrides,
  }
}

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
    chat: { id: 'chat_2', createdAt: '2026-05-14T00:00:00.000Z' },
    ...overrides,
  }
}

describe('<BriefingAssistantSurface>', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    vi.mocked(enrichForCycler).mockClear()
  })

  describe('enrichment gating', () => {
    it('skips enrichForCycler when the surface is closed', () => {
      render(
        <BriefingAssistantSurface
          open={false}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
        />,
      )

      expect(enrichForCycler).not.toHaveBeenCalled()
    })

    it('invokes enrichForCycler once when the surface is open', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
        />,
      )

      expect(enrichForCycler).toHaveBeenCalledTimes(1)
    })
  })

  describe('header', () => {
    it('renders the "Briefing assistant" title when open', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[]}
        />,
      )

      expect(screen.getByText('Briefing assistant')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('renders AskAiChatBody (composer-ready) with no annotationIdOverride when there are no chats', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[]}
        />,
      )

      const body = screen.getByTestId('chat-body')
      expect(body.getAttribute('data-annotation-id')).toBe('none')
      expect(body.getAttribute('data-json-path')).toBe('null')
    })
  })

  describe('populated state with an anchored chat', () => {
    it('renders the AskAiChatBody for the focused chat annotation', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
        />,
      )

      const body = screen.getByTestId('chat-body')
      expect(body).toBeInTheDocument()
      expect(body.getAttribute('data-annotation-id')).toBe('ann_anchored')
      expect(body.getAttribute('data-active')).toBe('true')
      expect(body.getAttribute('data-json-path')).toBe('agenda.0.title')
    })
  })

  describe('page-level chat (jsonPath is null)', () => {
    it('renders no blockquote when jsonPath is null', () => {
      const { container } = render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[pageLevelChat()]}
        />,
      )

      expect(container.querySelector('blockquote')).toBeNull()
    })

    it('passes a null jsonPath anchor through to AskAiChatBody', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[pageLevelChat()]}
        />,
      )

      const body = screen.getByTestId('chat-body')
      expect(body.getAttribute('data-annotation-id')).toBe('ann_page')
      expect(body.getAttribute('data-active')).toBe('true')
      expect(body.getAttribute('data-json-path')).toBe('null')
    })
  })
})
