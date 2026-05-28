import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type { Annotation } from '@shared/briefings/types'
import { BriefingAssistantSurface } from './BriefingAssistantSurface'
import { enrichForCycler } from './enrichForCycler'

const askAiChatBodyState: { autoSending: boolean } = { autoSending: false }

vi.mock('./AskAiChatBody', () => ({
  __esModule: true,
  default: vi.fn(
    ({
      annotationIdOverride,
      active,
      anchor,
      onSendingChange,
    }: {
      annotationIdOverride?: string
      active?: boolean
      anchor?: { jsonPath: string | null }
      onSendingChange?: (sending: boolean) => void
    }) => {
      if (askAiChatBodyState.autoSending && onSendingChange) {
        onSendingChange(true)
      }
      return (
        <div
          data-testid="chat-body"
          data-annotation-id={annotationIdOverride ?? 'none'}
          data-active={String(active)}
          data-json-path={String(anchor?.jsonPath ?? 'null')}
        />
      )
    },
  ),
}))

vi.mock('./enrichForCycler', async () => {
  const actual = await vi.importActual<typeof import('./enrichForCycler')>(
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
    askAiChatBodyState.autoSending = false
  })

  describe('enrichment gating', () => {
    it('skips enrichForCycler when the surface is closed', () => {
      render(
        <BriefingAssistantSurface
          open={false}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
          onDeleteChat={vi.fn()}
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
          onDeleteChat={vi.fn()}
        />,
      )

      expect(enrichForCycler).toHaveBeenCalledTimes(1)
    })
  })

  describe('header', () => {
    it('does not render a visible "Briefing assistant" panel title (sr-only label allowed for a11y)', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[]}
          onDeleteChat={vi.fn()}
        />,
      )

      // Radix Dialog requires a Title for screen readers; ours is sr-only.
      // What we DO NOT want is the old, visually-styled heading.
      const matches = screen.queryAllByText('Briefing assistant')
      for (const el of matches) {
        expect(el).toHaveClass('sr-only')
      }
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
          onDeleteChat={vi.fn()}
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
          onDeleteChat={vi.fn()}
        />,
      )

      const body = screen.getByTestId('chat-body')
      expect(body).toBeInTheDocument()
      expect(body.getAttribute('data-annotation-id')).toBe('ann_anchored')
      expect(body.getAttribute('data-active')).toBe('true')
      expect(body.getAttribute('data-json-path')).toBe('agenda.0.title')
    })
  })

  describe('Delete confirmation (anchored chat)', () => {
    it('opens a confirm dialog instead of deleting immediately when Delete chat is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteChat = vi.fn()

      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
          onDeleteChat={onDeleteChat}
        />,
      )

      await user.click(screen.getByRole('button', { name: /delete chat/i }))

      await screen.findByRole('alertdialog')
      expect(
        screen.getByRole('heading', { name: /delete this chat\?/i }),
      ).toBeInTheDocument()
      expect(screen.getByText(/can't undo this/i)).toBeInTheDocument()
      expect(onDeleteChat).not.toHaveBeenCalled()
    })

    it('closes the dialog and does not invoke onDeleteChat when Cancel is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteChat = vi.fn()

      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
          onDeleteChat={onDeleteChat}
        />,
      )

      await user.click(screen.getByRole('button', { name: /delete chat/i }))
      await screen.findByRole('alertdialog')
      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      expect(onDeleteChat).not.toHaveBeenCalled()
    })

    it('invokes onDeleteChat with the focused annotation when the destructive confirm is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteChat = vi.fn()
      const annotation = anchoredChat()

      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[annotation]}
          onDeleteChat={onDeleteChat}
        />,
      )

      await user.click(screen.getByRole('button', { name: /delete chat/i }))
      const dialog = await screen.findByRole('alertdialog')
      const confirm = within(dialog).getByRole('button', { name: /^delete$/i })
      await user.click(confirm)

      expect(onDeleteChat).toHaveBeenCalledTimes(1)
      expect(onDeleteChat).toHaveBeenCalledWith(
        expect.objectContaining({ id: annotation.id }),
      )
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
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
          onDeleteChat={vi.fn().mockResolvedValue(undefined)}
        />,
      )

      expect(container.querySelector('blockquote')).toBeNull()
    })

    it('hides the Delete chat button for a page-wide chat (jsonPath === null)', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[pageLevelChat()]}
          onDeleteChat={vi.fn().mockResolvedValue(undefined)}
        />,
      )

      expect(
        screen.queryByRole('button', { name: /delete chat/i }),
      ).not.toBeInTheDocument()
    })

    it('hides the Delete chat button for a page-wide chat with an empty-string jsonPath', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[pageLevelChat({ jsonPath: '' })]}
          onDeleteChat={vi.fn().mockResolvedValue(undefined)}
        />,
      )

      expect(
        screen.queryByRole('button', { name: /delete chat/i }),
      ).not.toBeInTheDocument()
    })

    it('shows the Delete chat button for a chat with a non-empty jsonPath', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
          onDeleteChat={vi.fn().mockResolvedValue(undefined)}
        />,
      )

      expect(
        screen.getByRole('button', { name: /delete chat/i }),
      ).toBeInTheDocument()
    })

    it('passes a null jsonPath anchor through to AskAiChatBody', () => {
      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[pageLevelChat()]}
          onDeleteChat={vi.fn().mockResolvedValue(undefined)}
        />,
      )

      const body = screen.getByTestId('chat-body')
      expect(body.getAttribute('data-annotation-id')).toBe('ann_page')
      expect(body.getAttribute('data-active')).toBe('true')
      expect(body.getAttribute('data-json-path')).toBe('null')
    })
  })

  describe('mid-stream guard', () => {
    it('disables the Delete chat button while the active chat is sending', () => {
      askAiChatBodyState.autoSending = true

      render(
        <BriefingAssistantSurface
          open={true}
          onClose={vi.fn()}
          meetingDate="2026-05-14"
          annotations={[anchoredChat()]}
          onDeleteChat={vi.fn().mockResolvedValue(undefined)}
        />,
      )

      const deleteButton = screen.getByRole('button', { name: /delete chat/i })
      expect(deleteButton).toBeDisabled()
    })
  })
})
