import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import TasksList from './TasksList'
import type { Task } from './TaskItem'
import type { Campaign } from 'helpers/types'
import { TASK_TYPES } from '../../shared/constants/tasks.const'

const mockClientFetch = vi.fn()
vi.mock('gpApi/clientFetch', () => ({
  clientFetch: (...args: unknown[]) => mockClientFetch(...args),
}))

const mockErrorSnackbar = vi.fn()
vi.mock('helpers/useSnackbar', () => ({
  useSnackbar: () => ({ errorSnackbar: mockErrorSnackbar }),
}))

vi.mock(
  'app/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider',
  () => ({
    useP2pUxEnabled: () => ({ p2pUxEnabled: false }),
  }),
)

vi.mock('app/dashboard/components/DashboardHeader', () => ({
  DashboardHeader: () => null,
}))

vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: vi.fn(),
  buildTrackingAttrs: vi.fn(() => ({})),
  EVENTS: { Outreach: { P2PCompliance: {} } },
}))

const AlertDialogContext = React.createContext<{
  onOpenChange: (open: boolean) => void
} | null>(null)

vi.mock('@styleguide', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    Card: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
    AlertDialog: ({
      open,
      onOpenChange,
      children,
    }: {
      open: boolean
      onOpenChange: (open: boolean) => void
      children: React.ReactNode
    }) =>
      open ? (
        <AlertDialogContext.Provider value={{ onOpenChange }}>
          <div role="alertdialog">{children}</div>
        </AlertDialogContext.Provider>
      ) : null,
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
    AlertDialogAction: ({
      children,
      onClick,
    }: {
      children: React.ReactNode
      onClick?: () => void
    }) => <button onClick={onClick}>{children}</button>,
    AlertDialogCancel: ({
      children,
      disabled,
    }: {
      children: React.ReactNode
      disabled?: boolean
    }) => {
      const ctx = React.useContext(AlertDialogContext)
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={() => ctx?.onOpenChange(false)}
        >
          {children}
        </button>
      )
    },
  }
})

vi.mock('./flows/DeadlineModal', () => ({ default: () => null }))
vi.mock('./flows/TaskFlow', () => ({ default: () => null }))
vi.mock('../../shared/ProUpgradeModal', () => ({
  ProUpgradeModal: () => null,
  VARIANTS: { Second_NonViable: 'a', Second_Viable: 'b' },
  VIABILITY_SCORE_THRESHOLD: 50,
}))
vi.mock('../../shared/P2PUpgradeModal', () => ({
  P2PUpgradeModal: () => null,
  P2P_MODAL_VARIANTS: { NonProUpgrade: 'a', ProFreeTextsNonCompliant: 'b' },
}))
vi.mock('../../shared/ComplianceModal', () => ({
  ComplianceModal: () => null,
}))
vi.mock('./LogTaskModal', () => ({
  default: () => null,
  TASK_TYPE_HEADINGS: {},
}))

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Test Task',
  description: 'A test task',
  flowType: TASK_TYPES.education,
  week: 1,
  completed: false,
  ...overrides,
})

const makeCampaign = (overrides: Partial<Campaign> = {}): Campaign =>
  ({
    isPro: false,
    details: { electionDate: '2026-11-03' },
    pathToVictory: { data: { viability: { score: 80 } } },
    hasFreeTextsOffer: false,
    ...overrides,
  } as unknown as Campaign)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TasksList revert completion flow', () => {
  it('shows revert dialog when clicking a completed task checkbox (non-legacy)', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByText('Mark task as incomplete?')).toBeInTheDocument()
  })

  it('does NOT show revert dialog for completed tasks in legacy lists', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })

    mockClientFetch.mockResolvedValue({ ok: true, data: completedTask })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={true}
      />,
    )

    await user.click(screen.getByRole('checkbox'))

    expect(
      screen.queryByText('Mark task as incomplete?'),
    ).not.toBeInTheDocument()
  })

  it('calls the revert API and updates the task when confirmed', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })
    const revertedTask = { ...completedTask, completed: false }

    mockClientFetch.mockResolvedValueOnce({
      ok: true,
      data: revertedTask,
    })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => {
      expect(mockClientFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/campaigns/tasks/complete/:taskId',
          method: 'DELETE',
        }),
        { taskId: 'task-1' },
      )
    })
  })

  it('closes the dialog after successful revert', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })

    mockClientFetch.mockResolvedValueOnce({
      ok: true,
      data: { ...completedTask, completed: false },
    })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  it('shows error snackbar when revert API fails', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })

    mockClientFetch.mockResolvedValueOnce({ ok: false, status: 500 })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalledWith(
        'Failed to mark task as incomplete',
      )
    })
  })

  it('shows error snackbar when revert API throws', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(vi.fn())

    mockClientFetch.mockRejectedValueOnce(new Error('network'))

    try {
      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[completedTask]}
          isLegacyList={false}
        />,
      )

      await user.click(screen.getByRole('checkbox'))
      await user.click(screen.getByRole('button', { name: 'Confirm' }))

      await waitFor(() => {
        expect(mockErrorSnackbar).toHaveBeenCalledWith(
          'Failed to mark task as incomplete',
        )
      })
    } finally {
      consoleError.mockRestore()
    }
  })

  it('dismisses the dialog when Cancel is used', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(mockClientFetch).not.toHaveBeenCalled()
  })

  it('shows revert dialog when clicking the action area of a completed non-legacy task', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Test Task/i }))

    expect(screen.getByText('Mark task as incomplete?')).toBeInTheDocument()
  })
})
