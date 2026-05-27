import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReportErrorSheet from './ReportErrorSheet'
import type { SheetState } from './AnnotationsScope'
import type { Annotation } from '@shared/briefings/types'

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

const reportErrorToSentryMock = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => reportErrorToSentryMock(...args),
}))

function makeNewSheet(): SheetState {
  return {
    kind: 'report_error_new',
    anchor: {
      jsonPath: 'p.0',
      start: 0,
      end: 5,
      quote: 'Hello world',
    },
  } as SheetState
}

function makeViewSheet(): SheetState {
  const annotation: Annotation = {
    id: 'ann_1',
    kind: 'bug_report',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: 'p.0',
    start: 0,
    end: 5,
    createdAt: '2026-05-26T00:00:00.000Z',
    updatedAt: '2026-05-26T00:00:00.000Z',
    bugReport: {
      id: 'bug_1',
      description: 'Existing report body',
      submittedAt: '2026-05-26T00:00:00.000Z',
    },
  }
  return {
    kind: 'report_error_view',
    annotation,
  } as SheetState
}

describe('<ReportErrorSheet>', () => {
  it('shows an inline error banner, keeps the sheet open, preserves description, and reports to Sentry when onCreate rejects', async () => {
    reportErrorToSentryMock.mockClear()
    const user = userEvent.setup()
    const onCreate = vi.fn().mockRejectedValue(new Error('network down'))
    const onClose = vi.fn()

    render(
      <ReportErrorSheet
        sheet={makeNewSheet()}
        position={null}
        onClose={onClose}
        onCreate={onCreate}
        onDelete={vi.fn()}
      />,
    )

    const textarea = screen.getByPlaceholderText(/describe the error/i)
    await user.type(textarea, 'My description')

    const submit = screen.getByRole('button', { name: /submit/i })
    await user.click(submit)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn't submit\. try again\./i)

    expect(onClose).not.toHaveBeenCalled()
    expect(textarea).toHaveValue('My description')
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
  })

  it('shows an inline error banner and reports to Sentry when onDelete rejects in view mode', async () => {
    reportErrorToSentryMock.mockClear()
    const user = userEvent.setup()
    const onDelete = vi.fn().mockRejectedValue(new Error('network down'))
    const onClose = vi.fn()

    render(
      <ReportErrorSheet
        sheet={makeViewSheet()}
        position={null}
        onClose={onClose}
        onCreate={vi.fn()}
        onDelete={onDelete}
      />,
    )

    const deleteBtn = screen.getByRole('button', { name: /delete report/i })
    await user.click(deleteBtn)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn't delete report\. try again\./i)

    expect(onClose).not.toHaveBeenCalled()
    expect(reportErrorToSentryMock).toHaveBeenCalledTimes(1)
  })

  it('closes the sheet and does not show an error banner when onCreate resolves', async () => {
    reportErrorToSentryMock.mockClear()
    const user = userEvent.setup()
    const onCreate = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()

    render(
      <ReportErrorSheet
        sheet={makeNewSheet()}
        position={null}
        onClose={onClose}
        onCreate={onCreate}
        onDelete={vi.fn()}
      />,
    )

    const textarea = screen.getByPlaceholderText(/describe the error/i)
    await user.type(textarea, 'Looks broken')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(reportErrorToSentryMock).not.toHaveBeenCalled()
  })

  it('clears a stale error banner when the user edits the textarea after a failed submit', async () => {
    reportErrorToSentryMock.mockClear()
    const user = userEvent.setup()
    const onCreate = vi
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(undefined)

    render(
      <ReportErrorSheet
        sheet={makeNewSheet()}
        position={null}
        onClose={vi.fn()}
        onCreate={onCreate}
        onDelete={vi.fn()}
      />,
    )

    const textarea = screen.getByPlaceholderText(/describe the error/i)
    await user.type(textarea, 'first try')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await user.type(textarea, ' more')

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the anchored quote via AnchoredQuote (with curly quotes) when in new mode', () => {
    render(
      <ReportErrorSheet
        sheet={makeNewSheet()}
        position={null}
        onClose={vi.fn()}
        onCreate={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    const blockquote = document.querySelector('blockquote')
    expect(blockquote).not.toBeNull()
    expect(blockquote?.textContent).toContain('Hello world')
    // AnchoredQuote wraps in typographic quotes — confirms we're using it
    // rather than the prior inline <blockquote>.
    expect(blockquote?.textContent).toMatch(/[“”]/)
    expect(blockquote?.className).toContain('border-destructive')
  })
})
