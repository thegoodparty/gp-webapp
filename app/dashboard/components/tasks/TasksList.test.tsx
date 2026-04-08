import type { ReactNode } from 'react'
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

const { mockUpdateVoterContactsLocal } = vi.hoisted(() => ({
  mockUpdateVoterContactsLocal: vi.fn(),
}))

vi.mock('@shared/hooks/useVoterContacts', () => ({
  useVoterContacts: () => [
    {
      doorKnocking: 0,
      calls: 0,
      digital: 0,
      directMail: 0,
      digitalAds: 0,
      text: 0,
      events: 0,
      yardSigns: 0,
      robocall: 0,
      phoneBanking: 0,
      socialMedia: 0,
    },
    vi.fn(),
    mockUpdateVoterContactsLocal,
  ],
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

vi.mock('@styleguide', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    Card: ({
      children,
      className,
    }: {
      children: ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
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
  mockUpdateVoterContactsLocal.mockReset()
})

describe('TasksList non-legacy event tasks', () => {
  it('uses the row only to open event details; external link stays in the modal', async () => {
    const user = userEvent.setup()
    mockClientFetch.mockResolvedValue({ ok: true, data: [] })

    const eventTask = makeTask({
      flowType: TASK_TYPES.events,
      link: 'https://example.com/event',
      completed: false,
    })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[eventTask]}
        isLegacyList={false}
      />,
    )

    const taskItem = document.querySelector('[data-slot="task-item"]')
    expect(taskItem).toBeTruthy()
    expect(taskItem?.querySelector('a[target="_blank"]')).toBeNull()

    await user.click(screen.getByRole('button', { name: /Test Task/i }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Learn more/i })).toHaveAttribute(
        'href',
        'https://example.com/event',
      )
    })
  })
})

describe('TasksList revert completion flow', () => {
  it('calls the revert API immediately when clicking a completed task checkbox (non-legacy)', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })
    const revertedTask = { ...completedTask, completed: false }

    mockClientFetch.mockResolvedValueOnce({ ok: true, data: revertedTask })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))

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

  it('does NOT revert completed tasks in legacy lists', async () => {
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

    expect(mockClientFetch).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'PUT' }),
      expect.anything(),
    )
    expect(mockClientFetch).not.toHaveBeenCalledWith(
      expect.objectContaining({ method: 'DELETE' }),
      expect.anything(),
    )
  })

  it('rolls back local voter contact count when revert fails after outreach complete', async () => {
    const user = userEvent.setup()
    const textTask = makeTask({
      flowType: TASK_TYPES.text,
      completed: false,
      week: 1,
    })
    const completedTextTask = { ...textTask, completed: true }

    let textTotal = 0
    mockUpdateVoterContactsLocal.mockImplementation((updater) => {
      const prev = {
        doorKnocking: 0,
        calls: 0,
        digital: 0,
        directMail: 0,
        digitalAds: 0,
        text: textTotal,
        events: 0,
        yardSigns: 0,
        robocall: 0,
        phoneBanking: 0,
        socialMedia: 0,
      }
      const next = typeof updater === 'function' ? updater(prev) : updater
      textTotal = next.text
    })

    mockClientFetch.mockImplementation(
      (route: { method?: string; path?: string }) => {
        if (
          route.method === 'PUT' &&
          route.path?.includes('/campaigns/tasks/complete/')
        ) {
          return Promise.resolve({ ok: true, data: completedTextTask })
        }
        if (
          route.method === 'GET' &&
          route.path?.includes('/campaigns/mine/update-history')
        ) {
          return Promise.resolve({ ok: true, data: [] })
        }
        if (
          route.method === 'DELETE' &&
          route.path?.includes('/campaigns/tasks/complete/')
        ) {
          return Promise.resolve({ ok: false, status: 500 })
        }
        return Promise.resolve({ ok: true, data: [] })
      },
    )

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[textTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))
    await user.type(screen.getByPlaceholderText('Enter amount'), '4')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(textTotal).toBe(4)
    })

    await user.click(screen.getByRole('checkbox'))

    await waitFor(() => {
      expect(mockErrorSnackbar).toHaveBeenCalledWith(
        'Failed to mark task as incomplete',
      )
    })

    expect(textTotal).toBe(4)
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

      await waitFor(() => {
        expect(mockErrorSnackbar).toHaveBeenCalledWith(
          'Failed to mark task as incomplete',
        )
      })
    } finally {
      consoleError.mockRestore()
    }
  })

  it('does not revert when clicking the row of a completed non-legacy task without a link', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })

    mockClientFetch.mockResolvedValue({ ok: true, data: completedTask })

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByText('Test Task'))

    expect(mockClientFetch).not.toHaveBeenCalledWith(
      expect.objectContaining({ method: 'DELETE' }),
      expect.anything(),
    )
  })

  it('ignores rapid duplicate clicks while a revert is in flight', async () => {
    const user = userEvent.setup()
    const completedTask = makeTask({ completed: true })
    const revertedTask = { ...completedTask, completed: false }

    let resolveFirst!: (v: unknown) => void
    mockClientFetch.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolveFirst = r
        }),
    )

    render(
      <TasksList
        campaign={makeCampaign()}
        tasks={[completedTask]}
        isLegacyList={false}
      />,
    )

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('checkbox'))

    resolveFirst({ ok: true, data: revertedTask })

    await waitFor(() => {
      expect(mockClientFetch).toHaveBeenCalledTimes(1)
    })
  })
})
