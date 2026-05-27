import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { BugReportsSurface } from './BugReportsSurface'
import * as enrichModule from './enrichForCycler'
import type { Annotation } from '@shared/briefings/types'

function bugReport(
  overrides: Partial<Annotation> & {
    bugReport?: { id?: string; description?: string; submittedAt?: string }
  } = {},
): Annotation {
  const submittedAt =
    overrides.bugReport?.submittedAt ?? '2026-05-26T15:30:00.000Z'
  const description =
    overrides.bugReport?.description ?? 'The agenda item is mislabeled.'
  const id = overrides.id ?? 'ann_1'
  return {
    id,
    kind: 'bug_report',
    resourceType: 'briefing',
    resourceId: 'briefing_1',
    authorUserId: 1,
    jsonPath: null,
    start: null,
    end: null,
    createdAt: submittedAt,
    updatedAt: submittedAt,
    bugReport: {
      id: overrides.bugReport?.id ?? `${id}_bug`,
      description,
      submittedAt,
    },
    ...overrides,
  }
}

describe('<BugReportsSurface>', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('renders the empty state when there are no annotations', () => {
    render(<BugReportsSurface open onClose={vi.fn()} annotations={[]} />)

    expect(screen.getByText(/no bug reports yet/i)).toBeInTheDocument()
  })

  it('renders the description and formatted submittedAt for a bug report', () => {
    const submittedAt = '2026-05-26T15:30:00.000Z'
    const annotation = bugReport({
      id: 'ann_1',
      bugReport: {
        id: 'bug_1',
        description: 'The agenda item is mislabeled.',
        submittedAt,
      },
    })

    render(
      <BugReportsSurface open onClose={vi.fn()} annotations={[annotation]} />,
    )

    expect(
      screen.getByText('The agenda item is mislabeled.'),
    ).toBeInTheDocument()
    const formatted = new Date(submittedAt).toLocaleString()
    const submittedNode = screen
      .getAllByText((_content, node) => {
        if (!node) return false
        if (node.children.length > 0) return false
        return node.textContent?.includes(formatted) ?? false
      })
      .find((n) =>
        n.parentElement?.textContent?.includes(`Submitted ${formatted}`),
      )
    expect(submittedNode).toBeDefined()
  })

  it('cycles to the next annotation when Next is clicked', async () => {
    const user = userEvent.setup()
    const annotations: Annotation[] = [
      bugReport({
        id: 'ann_1',
        createdAt: '2026-05-26T15:00:00.000Z',
        updatedAt: '2026-05-26T15:00:00.000Z',
        bugReport: {
          id: 'bug_1',
          description: 'First bug description',
          submittedAt: '2026-05-26T15:00:00.000Z',
        },
      }),
      bugReport({
        id: 'ann_2',
        createdAt: '2026-05-26T16:00:00.000Z',
        updatedAt: '2026-05-26T16:00:00.000Z',
        bugReport: {
          id: 'bug_2',
          description: 'Second bug description',
          submittedAt: '2026-05-26T16:00:00.000Z',
        },
      }),
    ]

    render(
      <BugReportsSurface open onClose={vi.fn()} annotations={annotations} />,
    )

    expect(screen.getByText('First bug description')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Second bug description')).toBeInTheDocument()
    expect(screen.queryByText('First bug description')).not.toBeInTheDocument()
  })

  it('renders no Edit button or destructive action (read-only surface)', () => {
    const annotation = bugReport()

    render(
      <BugReportsSurface open onClose={vi.fn()} annotations={[annotation]} />,
    )

    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /delete/i }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('does not enrich annotations while the surface is closed', () => {
    const enrichSpy = vi.spyOn(enrichModule, 'enrichForCycler')
    const annotations = [bugReport({ id: 'ann_1' })]

    render(
      <BugReportsSurface
        open={false}
        onClose={vi.fn()}
        annotations={annotations}
      />,
    )

    expect(enrichSpy).not.toHaveBeenCalled()
    enrichSpy.mockRestore()
  })

  it('uses no arbitrary pixel text utilities (text-[Npx]) in its rendered output', () => {
    const annotation = bugReport()

    render(
      <BugReportsSurface open onClose={vi.fn()} annotations={[annotation]} />,
    )

    const arbitraryPxPattern = /text-\[\d+px\]/
    const offenders: string[] = []
    document.body.querySelectorAll('[class]').forEach((el) => {
      const cls = el.getAttribute('class') ?? ''
      if (arbitraryPxPattern.test(cls)) offenders.push(cls)
    })
    expect(offenders).toEqual([])
  })
})
