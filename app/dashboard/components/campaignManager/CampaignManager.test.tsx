import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { render } from 'helpers/test-utils/render'
import CampaignManager from './CampaignManager'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

const mockUseCampaign = vi.fn()
const mockClientFetch = vi.fn()
const mockUseTaskGenerationStream = vi.fn()
const mockUsePostElectionState = vi.fn()
const mockStartGeneration = vi.fn()

vi.mock('app/dashboard/shared/DashboardLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

vi.mock('./LoadingState', () => ({
  default: ({
    hideCallback,
  }: {
    isStreamComplete: boolean
    hideCallback: () => void
  }) => <button onClick={hideCallback}>Hide loading</button>,
}))

vi.mock('./HeaderSection', () => ({ default: () => <div>Header</div> }))
vi.mock('./ProgressSection', () => ({ default: () => <div>Progress</div> }))
vi.mock('./FailedToGenerate', () => ({
  FailedToGenerate: () => <div>Failed</div>,
}))
vi.mock('../tasks/TasksList', () => ({ default: () => <div>Tasks list</div> }))
vi.mock('../EmptyState', () => ({ default: () => <div>Empty state</div> }))
vi.mock('@shared/hooks/VoterContactsProvider', () => ({
  VoterContactsProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}))
vi.mock('@shared/hooks/CampaignUpdateHistoryProvider', () => ({
  CampaignUpdateHistoryProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}))
vi.mock('../voterGoalsHelpers', () => ({
  calculateContactGoalsFromCampaign: () => ({ text: 1 }),
}))

vi.mock('@shared/hooks/useCampaign', () => ({
  useCampaign: () => mockUseCampaign(),
}))

vi.mock('@shared/hooks/usePositionName', () => ({
  usePositionName: () => 'Mayor',
}))

vi.mock('../usePostElectionState', () => ({
  usePostElectionState: () => mockUsePostElectionState(),
}))

vi.mock('../ElectionOver', () => ({
  default: () => <div>Election over</div>,
}))

vi.mock('../PrimaryResultModal', () => ({
  default: () => null,
}))

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: (...args: unknown[]) => mockClientFetch(...args),
}))

vi.mock('./useTaskGenerationStream', () => ({
  useTaskGenerationStream: (...args: unknown[]) =>
    mockUseTaskGenerationStream(...args),
}))

vi.mock('helpers/analyticsHelper', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    Dashboard: {
      CampaignPlan: {
        GenerationCompleted: 'Dashboard - Campaign Plan Generation Completed',
      },
    },
  },
}))

const mockTrackEvent = vi.mocked(trackEvent)

const makeTask = () => ({
  id: 'task-1',
  title: 'Task',
  description: 'Task description',
  flowType: 'events',
  week: 1,
  completed: false,
})

beforeEach(() => {
  vi.clearAllMocks()
  mockUseCampaign.mockReturnValue([
    {
      id: 'campaign-1',
      isPro: false,
      details: { electionDate: '2026-11-03' },
      raceTargetMetrics: {
        projectedTurnout: 0,
        winNumber: 0,
        voterContactGoal: 0,
      },
      hasFreeTextsOffer: false,
    },
  ])
  mockClientFetch.mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    data: [makeTask()],
  })
  mockUseTaskGenerationStream.mockReturnValue({
    isGenerating: true,
    progress: { message: 'Generating tasks', progress: 50 },
    error: null,
    startGeneration: mockStartGeneration,
    cancelGeneration: vi.fn(),
  })
  mockUsePostElectionState.mockReturnValue({
    electionInPast: false,
    primaryLost: false,
    primaryResultModalOpen: false,
    primaryElectionDate: undefined,
    electionDate: '2026-11-03',
    closePrimaryResultModal: vi.fn(),
  })
})

describe('CampaignManager generation tracking', () => {
  it('fires GenerationCompleted once after in-session generation and hiding the loading state', async () => {
    const user = userEvent.setup()
    const view = render(
      <CampaignManager pathname="/dashboard" tcrCompliance={null} />,
    )

    await user.click(screen.getByRole('button', { name: 'Hide loading' }))

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith(
        EVENTS.Dashboard.CampaignPlan.GenerationCompleted,
      )
    })

    view.rerender(
      <CampaignManager pathname="/dashboard" tcrCompliance={null} />,
    )

    expect(
      mockTrackEvent.mock.calls.filter(
        ([event]) =>
          event === EVENTS.Dashboard.CampaignPlan.GenerationCompleted,
      ),
    ).toHaveLength(1)
  })

  it('does NOT fire GenerationCompleted when no generation occurred in the session', async () => {
    mockUseTaskGenerationStream.mockReturnValue({
      isGenerating: false,
      progress: null,
      error: null,
      startGeneration: vi.fn(),
      cancelGeneration: vi.fn(),
    })

    render(<CampaignManager pathname="/dashboard" tcrCompliance={null} />)

    await waitFor(() => {
      expect(screen.getByText('Tasks list')).toBeInTheDocument()
    })

    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      EVENTS.Dashboard.CampaignPlan.GenerationCompleted,
    )
  })
})

describe('CampaignManager election-over branch', () => {
  it('renders ElectionOver and hides header/progress/tasks when the election is in the past', () => {
    mockUsePostElectionState.mockReturnValue({
      electionInPast: true,
      primaryLost: false,
      primaryResultModalOpen: false,
      primaryElectionDate: undefined,
      electionDate: '2026-01-01',
      closePrimaryResultModal: vi.fn(),
    })
    mockUseTaskGenerationStream.mockReturnValue({
      isGenerating: false,
      progress: null,
      error: null,
      startGeneration: mockStartGeneration,
      cancelGeneration: vi.fn(),
    })
    mockClientFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      data: [],
    })

    render(<CampaignManager pathname="/dashboard" tcrCompliance={null} />)

    expect(screen.getByText('Election over')).toBeInTheDocument()
    expect(screen.queryByText('Header')).not.toBeInTheDocument()
    expect(screen.queryByText('Progress')).not.toBeInTheDocument()
    expect(screen.queryByText('Tasks list')).not.toBeInTheDocument()
  })

  it('does not call startGeneration when the election is over even if there are no tasks', async () => {
    mockUsePostElectionState.mockReturnValue({
      electionInPast: true,
      primaryLost: false,
      primaryResultModalOpen: false,
      primaryElectionDate: undefined,
      electionDate: '2026-01-01',
      closePrimaryResultModal: vi.fn(),
    })
    mockUseTaskGenerationStream.mockReturnValue({
      isGenerating: false,
      progress: null,
      error: null,
      startGeneration: mockStartGeneration,
      cancelGeneration: vi.fn(),
    })
    mockClientFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      data: [],
    })

    render(<CampaignManager pathname="/dashboard" tcrCompliance={null} />)

    await waitFor(() => {
      expect(screen.getByText('Election over')).toBeInTheDocument()
    })

    expect(mockStartGeneration).not.toHaveBeenCalled()
  })
})
