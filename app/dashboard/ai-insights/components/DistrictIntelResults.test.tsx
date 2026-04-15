import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { DistrictIntelArtifact } from '../types'
import { DistrictIntelResults } from './DistrictIntelResults'

vi.mock('../hooks/useArtifact')
import { useArtifact } from '../hooks/useArtifact'
const mockUseArtifact = vi.mocked(useArtifact)

const mockArtifact: DistrictIntelArtifact = {
  official_name: 'Jane Doe',
  office: 'City Council Member',
  district: { state: 'OH', type: 'Municipal', name: 'Ward 3' },
  generated_at: '2026-03-30T12:00:00Z',
  summary: {
    total_constituents: 45000,
    issues_identified: 8,
    meetings_analyzed: 12,
    sources_consulted: 25,
  },
  issues: [
    {
      title: 'Road Infrastructure Decay',
      summary: 'Major potholes affecting commuter routes',
      status: 'Active',
      affected_constituents: 12000,
      affected_segments: [
        { name: 'Commuters', count: 8000, description: 'Daily commuters' },
      ],
      sources: [
        {
          id: 1,
          name: 'City Report',
          url: 'https://example.com/report',
          date: '2026-03-01',
        },
      ],
    },
    {
      title: 'Public Transit Funding',
      summary: 'Bus routes at risk of cuts',
      status: 'Pending',
      affected_constituents: 20000,
      affected_segments: [
        {
          name: 'Low-income residents',
          count: 15000,
          description: 'Residents dependent on transit',
        },
      ],
      sources: [
        {
          id: 2,
          name: 'Transit Authority',
          url: 'https://example.com/transit',
          date: '2026-02-15',
        },
      ],
    },
  ],
  demographic_snapshot: {
    total_voters: 30000,
    party_breakdown: [
      { party: 'Democrat', count: 15000 },
      { party: 'Independent', count: 10000 },
      { party: 'Republican', count: 5000 },
    ],
    age_distribution: [
      { range: '18-34', count: 10000 },
      { range: '35-54', count: 12000 },
      { range: '55+', count: 8000 },
    ],
  },
  methodology: 'Public records analysis',
}

describe('DistrictIntelResults', () => {
  it('shows loading spinner', () => {
    mockUseArtifact.mockReturnValue({
      artifact: null,
      loading: true,
      error: null,
      retry: vi.fn(),
    })

    render(<DistrictIntelResults runId="run-1" />)

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows error with retry button', async () => {
    const mockRetry = vi.fn()
    mockUseArtifact.mockReturnValue({
      artifact: null,
      loading: false,
      error: 'Failed to load report data.',
      retry: mockRetry,
    })

    render(<DistrictIntelResults runId="run-1" />)

    expect(screen.getByText('Failed to load report data.')).toBeInTheDocument()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await userEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('renders official name and office in header on success', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<DistrictIntelResults runId="run-1" />)

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/City Council Member/)).toBeInTheDocument()
  })

  it('renders summary stats on success', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<DistrictIntelResults runId="run-1" />)

    expect(screen.getByText('45,000')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders issue titles with status badges', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<DistrictIntelResults runId="run-1" />)

    expect(screen.getByText('Road Infrastructure Decay')).toBeInTheDocument()
    expect(screen.getByText('Public Transit Funding')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})
