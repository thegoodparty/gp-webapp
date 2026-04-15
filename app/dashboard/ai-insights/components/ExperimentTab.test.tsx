import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { ExperimentTab } from './ExperimentTab'
import { clientFetch } from 'gpApi/clientFetch'
import type { ExperimentRun } from '../types'

vi.mock('gpApi/clientFetch', () => ({
  clientFetch: vi.fn(),
}))

vi.mock('./VoterTargetingResults', () => ({
  VoterTargetingResults: ({ runId }: { runId: string }) => (
    <div data-testid="voter-targeting-results">{runId}</div>
  ),
}))

vi.mock('./WalkingPlanResults', () => ({
  WalkingPlanResults: ({ runId }: { runId: string }) => (
    <div data-testid="walking-plan-results">{runId}</div>
  ),
}))

vi.mock('./DistrictIntelResults', () => ({
  DistrictIntelResults: ({ runId }: { runId: string }) => (
    <div data-testid="district-intel-results">{runId}</div>
  ),
}))

vi.mock('./PeerCityBenchmarkingResults', () => ({
  PeerCityBenchmarkingResults: ({ runId }: { runId: string }) => (
    <div data-testid="peer-city-benchmarking-results">{runId}</div>
  ),
}))

vi.mock('./MeetingBriefingResults', () => ({
  MeetingBriefingResults: ({ runId }: { runId: string }) => (
    <div data-testid="meeting-briefing-results">{runId}</div>
  ),
}))

const mockClientFetch = clientFetch as Mock

function makeRun(overrides: Partial<ExperimentRun> = {}): ExperimentRun {
  return {
    id: 'run-1',
    runId: 'run-id-abc',
    experimentId: 'voter_targeting',
    candidateId: 'cand-1',
    status: 'SUCCESS',
    artifactKey: null,
    artifactBucket: null,
    durationSeconds: null,
    error: null,
    createdAt: '2026-03-15T12:00:00Z',
    updatedAt: '2026-03-15T12:05:00Z',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers({ shouldAdvanceTime: true })

  mockClientFetch.mockResolvedValue({
    ok: true,
    status: 200,
    data: { runs: [] },
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ExperimentTab', () => {
  it('shows description text', () => {
    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
      />,
    )

    expect(screen.getByText('Analyze your voter base')).toBeInTheDocument()
  })

  it('shows generate prompt when no run exists', () => {
    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
      />,
    )

    expect(
      screen.getByText(
        'No report generated yet. Click below to analyze your district.',
      ),
    ).toBeInTheDocument()
  })

  it('shows Generate Report button when no run exists', () => {
    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
      />,
    )

    expect(
      screen.getByRole('button', { name: /generate report/i }),
    ).toBeInTheDocument()
  })

  it('shows pending spinner when status is PENDING', () => {
    const run = makeRun({ status: 'PENDING' })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(
      screen.getByText(/generating your report/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/10-15 minutes/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /generate report/i }),
    ).not.toBeInTheDocument()
  })

  it('shows pending spinner when status is RUNNING', () => {
    const run = makeRun({ status: 'RUNNING' })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(
      screen.getByText(/generating your report/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/10-15 minutes/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /generate report/i }),
    ).not.toBeInTheDocument()
  })

  it('shows error message from run.error when status is FAILED', () => {
    const run = makeRun({
      status: 'FAILED',
      error: 'District data unavailable',
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(
      screen.getByText('District data unavailable'),
    ).toBeInTheDocument()
  })

  it('shows generic error when FAILED with no error message', () => {
    const run = makeRun({ status: 'FAILED', error: null })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(
      screen.getByText(/something went wrong generating your report/i),
    ).toBeInTheDocument()
  })

  it('shows Try Again button when FAILED', () => {
    const run = makeRun({ status: 'FAILED' })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument()
  })

  it('shows error alert when status is CONTRACT_VIOLATION', () => {
    const run = makeRun({
      status: 'CONTRACT_VIOLATION',
      error: 'Schema mismatch',
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(screen.getByText('Schema mismatch')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument()
  })

  it('shows stale message with Regenerate Report button', () => {
    const run = makeRun({ status: 'STALE' })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(
      screen.getByText(/regenerate to get fresh results/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /regenerate report/i }),
    ).toBeInTheDocument()
  })

  it('shows Generated date and Regenerate button on SUCCESS', () => {
    const run = makeRun({
      status: 'SUCCESS',
      updatedAt: '2026-03-15T12:05:00Z',
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(screen.getByText(/generated/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /regenerate/i }),
    ).toBeInTheDocument()
  })

  it('renders correct Results component for voter_targeting on SUCCESS', () => {
    const run = makeRun({
      status: 'SUCCESS',
      experimentId: 'voter_targeting',
      runId: 'vt-run-123',
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(
      screen.getByTestId('voter-targeting-results'),
    ).toHaveTextContent('vt-run-123')
  })

  it('renders correct Results component for district_intel on SUCCESS', () => {
    const run = makeRun({
      status: 'SUCCESS',
      experimentId: 'district_intel',
      runId: 'di-run-456',
    })

    render(
      <ExperimentTab
        experimentId="district_intel"
        description="Explore your district"
        initialRun={run}
      />,
    )

    expect(
      screen.getByTestId('district-intel-results'),
    ).toHaveTextContent('di-run-456')
  })

  it('shows API error message when POST returns non-ok with message', async () => {
    vi.useRealTimers()

    mockClientFetch.mockResolvedValue({
      ok: false,
      status: 400,
      data: {
        message: 'Your campaign needs a state and district set up to generate AI insights.',
        error: 'Bad Request',
        statusCode: 400,
      },
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /generate report/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/your campaign needs a state and district/i),
      ).toBeInTheDocument()
    })
  })

  it('shows generic error when POST returns non-ok without message', async () => {
    vi.useRealTimers()

    mockClientFetch.mockResolvedValue({
      ok: false,
      status: 500,
      data: null,
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /generate report/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/failed to request report/i),
      ).toBeInTheDocument()
    })
  })

  it('shows network error when POST throws', async () => {
    vi.useRealTimers()

    mockClientFetch.mockRejectedValue(new Error('Network failure'))

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /generate report/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/network error/i),
      ).toBeInTheDocument()
    })
  })

  it('shows per-experiment time estimate for serve experiments', () => {
    const run = makeRun({
      status: 'PENDING',
      experimentId: 'district_intel',
    })

    render(
      <ExperimentTab
        experimentId="district_intel"
        description="Explore your district"
        initialRun={run}
      />,
    )

    expect(screen.getByText(/15-30 minutes/i)).toBeInTheDocument()
  })

  it('shows extended wait message after 10 minutes of polling', async () => {
    const run = makeRun({ status: 'PENDING' })

    mockClientFetch.mockResolvedValue({
      ok: true,
      data: [makeRun({ status: 'PENDING' })],
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    expect(screen.getByText(/generating your report/i)).toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(10 * 60 * 1000 + 1000)

    await waitFor(() => {
      expect(
        screen.getByText(/taking longer than expected/i),
      ).toBeInTheDocument()
    })
  })

  it('shows timeout error after 45 minutes of polling', async () => {
    const run = makeRun({ status: 'PENDING' })

    mockClientFetch.mockResolvedValue({
      ok: true,
      data: [makeRun({ status: 'RUNNING' })],
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={run}
      />,
    )

    await vi.advanceTimersByTimeAsync(45 * 60 * 1000 + 1000)

    await waitFor(() => {
      expect(screen.getByText(/timed out/i)).toBeInTheDocument()
    })

    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument()
  })

  it('clears timeout state when a new request is made', async () => {
    vi.useRealTimers()

    mockClientFetch.mockResolvedValue({
      ok: true,
      data: { runId: 'new-run', status: 'PENDING' },
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={makeRun({ status: 'FAILED' })}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => {
      expect(screen.getByText(/generating your report/i)).toBeInTheDocument()
    })

    expect(screen.queryByText(/timed out/i)).not.toBeInTheDocument()
  })

  it('resets timeout UI when retrying from a timed-out pending run', async () => {
    const pendingRun = makeRun({ status: 'PENDING', runId: 'old-run' })

    mockClientFetch.mockResolvedValue({
      ok: true,
      data: [makeRun({ status: 'PENDING', runId: 'old-run' })],
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
        initialRun={pendingRun}
      />,
    )

    await vi.advanceTimersByTimeAsync(45 * 60 * 1000 + 1000)

    await waitFor(() => {
      expect(screen.getByText(/timed out/i)).toBeInTheDocument()
    })

    vi.useRealTimers()

    mockClientFetch.mockResolvedValue({
      ok: true,
      data: { runId: 'new-run', status: 'PENDING' },
    })

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => {
      expect(screen.getByText(/generating your report/i)).toBeInTheDocument()
    })
    expect(screen.queryByText(/timed out/i)).not.toBeInTheDocument()
  })

  it('transitions to PENDING after clicking Generate Report', async () => {
    vi.useRealTimers()

    mockClientFetch.mockResolvedValue({
      ok: true,
      status: 200,
      data: { success: true },
    })

    render(
      <ExperimentTab
        experimentId="voter_targeting"
        description="Analyze your voter base"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /generate report/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/generating your report/i),
      ).toBeInTheDocument()
    })
  })
})
