import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { ExperimentRun } from '../types'

const mockUseOrganization = vi.fn(() => undefined)
vi.mock('@shared/organization-picker', () => ({
  useOrganization: () => mockUseOrganization(),
}))

vi.mock('../../shared/DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('./ExperimentTab', () => ({
  ExperimentTab: ({
    experimentId,
    description,
  }: {
    experimentId: string
    description: string
  }) => <div data-testid={`tab-${experimentId}`}>{description}</div>,
}))

vi.mock('gpApi/clientFetch', () => ({
  default: vi.fn(),
}))

import { AIInsightsPage } from './AIInsightsPage'

const defaultProps = {
  pathname: '/dashboard/ai-insights',
  campaign: null,
  initialRuns: [] as ExperimentRun[],
}

beforeEach(() => {
  mockUseOrganization.mockReturnValue(undefined)
})

describe('AIInsightsPage', () => {
  it('renders Voter Targeting and Walking Plan tabs in win mode', () => {
    render(<AIInsightsPage {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: /voter targeting/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /walking plan/i }),
    ).toBeInTheDocument()
  })

  it('does not show serve tabs in win mode', () => {
    render(<AIInsightsPage {...defaultProps} />)

    expect(
      screen.queryByRole('button', { name: /district intel/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /peer city benchmarking/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /meeting briefing/i }),
    ).not.toBeInTheDocument()
  })

  it('renders District Intel, Peer City Benchmarking, and Meeting Briefing tabs in serve mode', () => {
    mockUseOrganization.mockReturnValue({ electedOfficeId: 'eo-123' })

    render(<AIInsightsPage {...defaultProps} />)

    expect(
      screen.getByRole('button', { name: /district intel/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /peer city benchmarking/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /meeting briefing/i }),
    ).toBeInTheDocument()
  })

  it('does not show win tabs in serve mode', () => {
    mockUseOrganization.mockReturnValue({ electedOfficeId: 'eo-123' })

    render(<AIInsightsPage {...defaultProps} />)

    expect(
      screen.queryByRole('button', { name: /voter targeting/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /walking plan/i }),
    ).not.toBeInTheDocument()
  })

  it('defaults to first tab as active', () => {
    render(<AIInsightsPage {...defaultProps} />)

    expect(screen.getByTestId('tab-voter_targeting')).toBeInTheDocument()
  })

  it('switches active tab when clicking another tab', async () => {
    const user = userEvent.setup()

    render(<AIInsightsPage {...defaultProps} />)

    expect(screen.getByTestId('tab-voter_targeting')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /walking plan/i }))

    expect(screen.getByTestId('tab-walking_plan')).toBeInTheDocument()
    expect(screen.queryByTestId('tab-voter_targeting')).not.toBeInTheDocument()
  })

  it('shows AI Insights heading', () => {
    render(<AIInsightsPage {...defaultProps} />)

    expect(
      screen.getByRole('heading', { name: /ai insights/i }),
    ).toBeInTheDocument()
  })

  it('shows AI-generated content disclaimer', () => {
    render(<AIInsightsPage {...defaultProps} />)

    expect(screen.getByText(/ai-generated/i)).toBeInTheDocument()
  })
})
