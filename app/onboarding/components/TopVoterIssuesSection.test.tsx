import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, testQueryClient } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import { TopVoterIssuesSection } from './TopVoterIssuesSection'

const mockReportErrorToSentry = vi.fn()
vi.mock('@shared/sentry', () => ({
  reportErrorToSentry: (...args: unknown[]) => mockReportErrorToSentry(...args),
}))

const issues = [
  { label: 'Public Safety', score: 82, priority: 'high' as const },
  { label: 'Affordable Housing', score: 71, priority: 'high' as const },
  { label: 'Education', score: 64, priority: 'medium' as const },
  { label: 'Healthcare', score: 55, priority: 'medium' as const },
  { label: 'Climate', score: 41, priority: 'low' as const },
]

beforeEach(() => {
  testQueryClient.clear()
  mockReportErrorToSentry.mockReset()
})

describe('TopVoterIssuesSection', () => {
  it('renders skeleton placeholders while the request is pending', () => {
    api.mock(
      'GET /v1/onboarding/voter-issues',
      () => new Promise(() => undefined),
    )

    const { container } = render(<TopVoterIssuesSection office="Mayor" />)

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    )
  })

  it('renders nothing when the API returns an empty list', async () => {
    api.mock('GET /v1/onboarding/voter-issues', {
      status: 200,
      data: { issues: [] },
    })

    const { container } = render(<TopVoterIssuesSection office="Mayor" />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('renders nothing and reports the error when the request fails', async () => {
    api.mock('GET /v1/onboarding/voter-issues', {
      status: 500,
      data: { message: 'boom' },
    })

    const noRetryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { container } = rtlRender(
      <QueryClientProvider client={noRetryClient}>
        <TopVoterIssuesSection office="Mayor" />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(mockReportErrorToSentry).toHaveBeenCalled()
    })
    expect(container.firstChild).toBeNull()
  })

  it('shows the office name in the description when provided', async () => {
    api.mock('GET /v1/onboarding/voter-issues', {
      status: 200,
      data: { issues: issues.slice(0, 1) },
    })

    render(<TopVoterIssuesSection office="Mayor of Springfield" />)

    expect(await screen.findByText(/Mayor of Springfield/)).toBeInTheDocument()
  })

  it('falls back to city, state when office is missing', async () => {
    api.mock('GET /v1/onboarding/voter-issues', {
      status: 200,
      data: { issues: issues.slice(0, 1) },
    })

    render(<TopVoterIssuesSection city="Austin" state="TX" />)

    expect(await screen.findByText(/Austin, TX/)).toBeInTheDocument()
  })

  it('falls back to the generic copy when no audience info is provided', async () => {
    api.mock('GET /v1/onboarding/voter-issues', {
      status: 200,
      data: { issues: issues.slice(0, 1) },
    })

    render(<TopVoterIssuesSection />)

    expect(
      await screen.findByText(/your voters care about most/i),
    ).toBeInTheDocument()
  })

  it('refetches when ballotReadyPositionId changes (no stale cross-office cache)', async () => {
    api.mockOrdered('GET /v1/onboarding/voter-issues', [
      {
        status: 200,
        data: {
          issues: [
            { label: 'Beverly Hills issue', score: 80, priority: 'high' },
          ],
        },
      },
      {
        status: 200,
        data: {
          issues: [{ label: 'NYC issue', score: 90, priority: 'high' }],
        },
      },
    ])

    const { rerender } = render(
      <TopVoterIssuesSection
        ballotReadyPositionId="bh-123"
        office="Beverly Hills City Council"
      />,
    )

    expect(await screen.findByText('Beverly Hills issue')).toBeInTheDocument()

    rerender(
      <TopVoterIssuesSection
        ballotReadyPositionId="nyc-456"
        office="NYC City Council"
      />,
    )

    expect(await screen.findByText('NYC issue')).toBeInTheDocument()
    expect(screen.queryByText('Beverly Hills issue')).not.toBeInTheDocument()
  })

  it('renders issues as a numbered ranking without score bars or percentages', async () => {
    api.mock('GET /v1/onboarding/voter-issues', {
      status: 200,
      data: { issues },
    })

    render(<TopVoterIssuesSection office="Mayor" />)

    expect(await screen.findByText('Public Safety')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.queryByText(/voters care/i)).not.toBeInTheDocument()
  })

  it('collapses to the first three issues and expands on demand', async () => {
    api.mock('GET /v1/onboarding/voter-issues', {
      status: 200,
      data: { issues },
    })

    render(<TopVoterIssuesSection office="Mayor" />)

    expect(await screen.findByText('Public Safety')).toBeInTheDocument()
    expect(screen.getByText('Affordable Housing')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.queryByText('Healthcare')).not.toBeInTheDocument()
    expect(screen.queryByText('Climate')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /view 2 more/i }))

    expect(screen.getByText('Healthcare')).toBeInTheDocument()
    expect(screen.getByText('Climate')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: /show fewer issues/i }),
    )
    expect(screen.queryByText('Healthcare')).not.toBeInTheDocument()
  })
})
