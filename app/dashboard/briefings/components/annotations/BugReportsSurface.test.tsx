import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
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
    render(
      <BugReportsSurface
        open
        onClose={vi.fn()}
        annotations={[]}
        onDeleteBugReport={vi.fn()}
      />,
    )

    expect(screen.getByText(/no bug reports yet/i)).toBeInTheDocument()
  })

  it('renders the subtitle explaining the surface', () => {
    render(
      <BugReportsSurface
        open
        onClose={vi.fn()}
        annotations={[bugReport()]}
        onDeleteBugReport={vi.fn()}
      />,
    )

    // AnnotationSurfaceSheet renders the subtitle twice: once visibly in
    // the cycler header and once in an sr-only DrawerDescription for a11y.
    // Confirm at least one is present.
    expect(
      screen.getAllByText(
        /spot an error\? describe what's wrong and we'll fix it\./i,
      ).length,
    ).toBeGreaterThan(0)
  })

  it('renders the description for a bug report', () => {
    const annotation = bugReport({
      id: 'ann_1',
      bugReport: {
        id: 'bug_1',
        description: 'The agenda item is mislabeled.',
        submittedAt: '2026-05-26T15:30:00.000Z',
      },
    })

    render(
      <BugReportsSurface
        open
        onClose={vi.fn()}
        annotations={[annotation]}
        onDeleteBugReport={vi.fn()}
      />,
    )

    expect(
      screen.getByText('The agenda item is mislabeled.'),
    ).toBeInTheDocument()
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
      <BugReportsSurface
        open
        onClose={vi.fn()}
        annotations={annotations}
        onDeleteBugReport={vi.fn()}
      />,
    )

    expect(screen.getByText('First bug description')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('Second bug description')).toBeInTheDocument()
    expect(screen.queryByText('First bug description')).not.toBeInTheDocument()
  })

  describe('Delete confirmation', () => {
    it('opens a confirm dialog instead of deleting immediately when Delete bug report is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteBugReport = vi.fn()

      render(
        <BugReportsSurface
          open
          onClose={vi.fn()}
          annotations={[bugReport()]}
          onDeleteBugReport={onDeleteBugReport}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: /delete bug report/i }),
      )

      await screen.findByRole('alertdialog')
      expect(
        screen.getByRole('heading', { name: /delete this bug report\?/i }),
      ).toBeInTheDocument()
      expect(screen.getByText(/can't undo this/i)).toBeInTheDocument()
      expect(onDeleteBugReport).not.toHaveBeenCalled()
    })

    it('closes the dialog and does not invoke onDeleteBugReport when Cancel is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteBugReport = vi.fn()

      render(
        <BugReportsSurface
          open
          onClose={vi.fn()}
          annotations={[bugReport()]}
          onDeleteBugReport={onDeleteBugReport}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: /delete bug report/i }),
      )
      await screen.findByRole('alertdialog')
      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      expect(onDeleteBugReport).not.toHaveBeenCalled()
    })

    it('invokes onDeleteBugReport with the focused annotation when the destructive confirm is clicked', async () => {
      const user = userEvent.setup()
      const annotation = bugReport()
      const onDeleteBugReport = vi.fn()

      render(
        <BugReportsSurface
          open
          onClose={vi.fn()}
          annotations={[annotation]}
          onDeleteBugReport={onDeleteBugReport}
        />,
      )

      await user.click(
        screen.getByRole('button', { name: /delete bug report/i }),
      )
      const dialog = await screen.findByRole('alertdialog')
      const confirm = within(dialog).getByRole('button', { name: /^delete$/i })
      await user.click(confirm)

      expect(onDeleteBugReport).toHaveBeenCalledTimes(1)
      expect(onDeleteBugReport).toHaveBeenCalledWith(
        expect.objectContaining({ id: annotation.id }),
      )
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  it('does not enrich annotations while the surface is closed', () => {
    const enrichSpy = vi.spyOn(enrichModule, 'enrichForCycler')
    const annotations = [bugReport({ id: 'ann_1' })]

    render(
      <BugReportsSurface
        open={false}
        onClose={vi.fn()}
        annotations={annotations}
        onDeleteBugReport={vi.fn()}
      />,
    )

    expect(enrichSpy).not.toHaveBeenCalled()
    enrichSpy.mockRestore()
  })

  it('uses no arbitrary pixel text utilities (text-[Npx]) in its rendered output', () => {
    const annotation = bugReport()

    render(
      <BugReportsSurface
        open
        onClose={vi.fn()}
        annotations={[annotation]}
        onDeleteBugReport={vi.fn()}
      />,
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
