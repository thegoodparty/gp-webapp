import type { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import TasksList from './TasksList'
import type { Task } from './TaskItem'
import type { Campaign } from 'helpers/types'
import {
  TASK_TYPES,
  STATUS_CHANGES,
  TRACKING_SOURCES,
} from '../../shared/constants/tasks.const'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { identifyUser } from '@shared/utils/analytics'
import { differenceInDays } from 'date-fns'

const mockClientFetch = vi.fn()
const mockUseUser = vi.fn()

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: (...args: unknown[]) => mockClientFetch(...args),
}))

vi.mock('@shared/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
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
  EVENTS: {
    Outreach: { P2PCompliance: {} },
    Dashboard: {
      CampaignPlan: {
        GenerationCompleted: 'Dashboard - Campaign Plan Generation Completed',
        Viewed: 'Dashboard - Campaign Plan Viewed',
        WeekNavigated: 'Dashboard - Campaign Plan Week Navigated',
        TaskCTAClicked: 'Dashboard - Campaign Plan Task CTA Clicked',
        TaskStatusUpdated: 'Dashboard - Campaign Task Status Updated',
        VoterContactDialogViewed: 'Dashboard - Voter Contact Dialog Viewed',
        VoterContactRecorded: 'Dashboard - Voter Contact Recorded',
      },
    },
  },
}))

vi.mock('@shared/utils/analytics', () => ({
  identifyUser: vi.fn(),
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
vi.mock('./flows/TaskFlow', () => ({
  default: ({ onComplete }: { onComplete?: () => void | Promise<void> }) => (
    <button onClick={() => void onComplete?.()}>Complete flow</button>
  ),
}))
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
    id: 'campaign-1',
    isPro: false,
    details: { electionDate: '2026-11-03' },
    pathToVictory: { data: { viability: { score: 80 } } },
    hasFreeTextsOffer: false,
    ...overrides,
  } as unknown as Campaign)

beforeEach(() => {
  vi.clearAllMocks()
  sessionStorage.clear()
  mockUseUser.mockReturnValue([{ id: 'user-1' }, vi.fn()])
  mockClientFetch.mockImplementation(
    (route: { path?: string; method?: string }) => {
      if (
        route.path === '/campaigns/mine/update-history' &&
        route.method === 'GET'
      ) {
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          data: [],
        })
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        data: undefined,
      })
    },
  )
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

  it('calls the revert API when clicking the action area of a completed non-legacy task', async () => {
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

    await user.click(screen.getByRole('button', { name: /Test Task/i }))

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
      expect(
        mockClientFetch.mock.calls.filter(
          ([route]) =>
            route?.path === '/campaigns/tasks/complete/:taskId' &&
            route?.method === 'DELETE',
        ),
      ).toHaveLength(1)
    })
  })
})

describe('TasksList tracking events', () => {
  const mockTrackEvent = vi.mocked(trackEvent)
  const mockIdentifyUser = vi.mocked(identifyUser)

  describe('Campaign Plan Viewed', () => {
    it('fires Viewed event with the selected week counts', () => {
      sessionStorage.setItem('campaign-plan-selected-week:campaign-1', '30')
      const tasks = [
        makeTask({ id: 'task-1', week: 30, completed: false }),
        makeTask({ id: 'task-2', week: 30, completed: true }),
        makeTask({ id: 'task-3', week: 29, completed: true }),
      ]

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={tasks}
          isLegacyList={false}
        />,
      )

      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.Viewed,
        {
          tasksThisWeek: 2,
          tasksCompletedThisWeek: 1,
        },
      )
    })

    it('does NOT fire Viewed event for legacy lists', () => {
      const task = makeTask({ week: 30 })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={true}
        />,
      )

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.Viewed,
        expect.anything(),
      )
    })

    it('does NOT re-fire Viewed event when tasks are completed within the same week', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        week: 30,
        flowType: TASK_TYPES.education,
        completed: false,
      })
      const completedTask = { ...task, completed: true }

      mockClientFetch.mockResolvedValueOnce({ ok: true, data: completedTask })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      const viewedCallCount = mockTrackEvent.mock.calls.filter(
        ([event]) => event === EVENTS.Dashboard.CampaignPlan.Viewed,
      ).length

      await user.click(screen.getByRole('checkbox'))
      await waitFor(() => {
        expect(mockClientFetch).toHaveBeenCalled()
      })

      const viewedCallCountAfter = mockTrackEvent.mock.calls.filter(
        ([event]) => event === EVENTS.Dashboard.CampaignPlan.Viewed,
      ).length

      expect(viewedCallCountAfter).toBe(viewedCallCount)
    })

    it('identifies the real user when the user becomes available after initial render', async () => {
      mockUseUser.mockReturnValueOnce([null, vi.fn()])

      const task = makeTask({ week: 30 })
      const view = render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      expect(mockIdentifyUser).not.toHaveBeenCalledWith(
        'user-1',
        expect.anything(),
      )

      mockUseUser.mockReturnValue([{ id: 'user-1' }, vi.fn()])
      view.rerender(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      await waitFor(() => {
        expect(mockIdentifyUser).toHaveBeenCalledWith('user-1', {
          campaignPlanTasksTotal: 1,
          campaignPlanTasksCompleted: 0,
        })
      })
    })
  })

  describe('Task Status Updated', () => {
    it('fires TaskStatusUpdated after successful completion via checkbox', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.events,
        completed: false,
      })
      const completedTask = { ...task, completed: true }

      mockClientFetch.mockResolvedValueOnce({ ok: true, data: completedTask })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      await user.click(screen.getByRole('checkbox'))

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith(
          EVENTS.Dashboard.CampaignPlan.TaskStatusUpdated,
          expect.objectContaining({
            statusChange: STATUS_CHANGES.complete,
            source: TRACKING_SOURCES.manualCheckoff,
          }),
        )
      })
    })

    it('fires TaskStatusUpdated with incomplete on successful revert', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.events,
        completed: true,
      })
      const revertedTask = { ...task, completed: false }

      mockClientFetch.mockResolvedValueOnce({ ok: true, data: revertedTask })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      await user.click(screen.getByRole('checkbox'))

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith(
          EVENTS.Dashboard.CampaignPlan.TaskStatusUpdated,
          expect.objectContaining({
            statusChange: STATUS_CHANGES.incomplete,
            source: TRACKING_SOURCES.manualCheckoff,
          }),
        )
      })
    })

    it('does NOT fire TaskStatusUpdated when API fails', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.education,
        completed: false,
      })

      mockClientFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      await user.click(screen.getByRole('checkbox'))

      await waitFor(() => {
        expect(mockErrorSnackbar).toHaveBeenCalled()
      })

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.TaskStatusUpdated,
        expect.anything(),
      )
    })

    it('does NOT fire TaskStatusUpdated for legacy lists', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.education,
        completed: false,
      })
      const completedTask = { ...task, completed: true }

      mockClientFetch.mockResolvedValueOnce({ ok: true, data: completedTask })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={true}
        />,
      )

      await user.click(screen.getByRole('checkbox'))

      await waitFor(() => {
        expect(mockClientFetch).toHaveBeenCalled()
      })

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.TaskStatusUpdated,
        expect.anything(),
      )
    })

    it('calls identifyUser with updated task counts on completion', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.events,
        completed: false,
      })
      const completedTask = { ...task, completed: true }

      mockClientFetch.mockResolvedValueOnce({ ok: true, data: completedTask })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      await user.click(screen.getByRole('checkbox'))

      await waitFor(() => {
        expect(mockIdentifyUser).toHaveBeenCalledWith('user-1', {
          campaignPlanTasksTotal: 1,
          campaignPlanTasksCompleted: 1,
        })
      })
    })

    it('fires TaskStatusUpdated with schedulingFlow after successful flow completion', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.robocall,
        completed: false,
      })
      const completedTask = { ...task, completed: true }

      mockClientFetch.mockResolvedValueOnce({ ok: true, data: completedTask })

      render(
        <TasksList
          campaign={makeCampaign({ isPro: true })}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      await user.click(screen.getByRole('button', { name: /Test Task/i }))
      await user.click(screen.getByRole('button', { name: 'Complete flow' }))

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith(
          EVENTS.Dashboard.CampaignPlan.TaskStatusUpdated,
          expect.objectContaining({
            statusChange: STATUS_CHANGES.complete,
            source: TRACKING_SOURCES.schedulingFlow,
            taskType: 'robocall',
          }),
        )
      })
    })

    it('does NOT fire schedulingFlow TaskStatusUpdated when flow completion API fails', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.robocall,
        completed: false,
      })

      mockClientFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      render(
        <TasksList
          campaign={makeCampaign({ isPro: true })}
          tasks={[task]}
          isLegacyList={false}
        />,
      )

      await user.click(screen.getByRole('button', { name: /Test Task/i }))
      await user.click(screen.getByRole('button', { name: 'Complete flow' }))

      await waitFor(() => {
        expect(mockErrorSnackbar).toHaveBeenCalledWith(
          'Failed to complete task',
        )
      })

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.TaskStatusUpdated,
        expect.objectContaining({
          source: TRACKING_SOURCES.schedulingFlow,
        }),
      )
    })
  })

  describe('Task CTA Clicked', () => {
    it('fires TaskCTAClicked when action button is clicked for a trackable task type', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.text,
        completed: false,
      })

      render(
        <TasksList
          campaign={makeCampaign({ isPro: true })}
          tasks={[task]}
          isLegacyList={false}
          tcrCompliance={{ status: 'APPROVED' } as never}
        />,
      )

      await user.click(screen.getByRole('button', { name: /Test Task/i }))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.TaskCTAClicked,
        { taskType: 'text' },
      )
    })

    it('does NOT fire TaskCTAClicked for legacy lists', async () => {
      const user = userEvent.setup()
      const task = makeTask({
        flowType: TASK_TYPES.education,
        completed: false,
      })

      mockClientFetch.mockResolvedValue({ ok: true, data: task })

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={[task]}
          isLegacyList={true}
        />,
      )

      await user.click(screen.getByRole('button', { name: /Test Task/i }))

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.TaskCTAClicked,
        expect.anything(),
      )
    })
  })

  describe('Week Navigated', () => {
    const getCurrentWeek = () =>
      Math.ceil(differenceInDays(new Date('2026/11/03'), new Date()) / 7)

    it('fires WeekNavigated with direction "next" when navigating forward', async () => {
      const user = userEvent.setup()
      const currentWeek = getCurrentWeek()
      sessionStorage.setItem(
        'campaign-plan-selected-week:campaign-1',
        String(currentWeek + 1),
      )
      const tasks = [
        makeTask({ id: 'task-1', week: currentWeek + 1 }),
        makeTask({ id: 'task-2', week: currentWeek }),
      ]

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={tasks}
          isLegacyList={false}
        />,
      )

      const nextButton = screen.getByRole('button', { name: /next week/i })
      expect(nextButton).not.toBeDisabled()

      await user.click(nextButton)

      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.WeekNavigated,
        {
          direction: 'next',
          weekRelativePosition: 'current',
        },
      )
    })

    it('fires WeekNavigated with direction "previous" when navigating back', async () => {
      const user = userEvent.setup()
      const currentWeek = getCurrentWeek()
      sessionStorage.setItem(
        'campaign-plan-selected-week:campaign-1',
        String(currentWeek),
      )
      const tasks = [
        makeTask({ id: 'task-1', week: currentWeek + 1 }),
        makeTask({ id: 'task-2', week: currentWeek }),
      ]

      render(
        <TasksList
          campaign={makeCampaign()}
          tasks={tasks}
          isLegacyList={false}
        />,
      )

      const prevButton = screen.getByRole('button', {
        name: /previous week/i,
      })
      expect(prevButton).not.toBeDisabled()

      await user.click(prevButton)

      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.WeekNavigated,
        {
          direction: 'previous',
          weekRelativePosition: 'past',
        },
      )
    })
  })
})
