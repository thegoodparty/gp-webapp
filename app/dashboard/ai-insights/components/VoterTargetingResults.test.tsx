import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { VoterTargetingArtifact } from '../types'
import { VoterTargetingResults } from './VoterTargetingResults'

vi.mock('../hooks/useArtifact')
import { useArtifact } from '../hooks/useArtifact'
const mockUseArtifact = vi.mocked(useArtifact)

const mockArtifact: VoterTargetingArtifact = {
  candidate_id: 'cand-1',
  district: { state: 'OH', type: 'State House', name: 'District 42' },
  generated_at: '2026-03-30T12:00:00Z',
  summary: {
    total_voters_in_district: 125000,
    win_number: 18500,
    projected_turnout: 45000,
  },
  segments: [
    {
      tier: 1,
      name: 'High-Propensity Independents',
      description: 'Voters who vote in every election',
      count: 4200,
      filters_used: ['independent', 'high-propensity'],
      demographics: {
        party_breakdown: { Independent: 4200 },
        age_distribution: { '25-44': 2100, '45-64': 2100 },
        gender_split: { Male: 2000, Female: 2200 },
      },
      outreach_priority: 'Critical',
      recommended_channels: ['Door-to-door', 'Text'],
    },
    {
      tier: 2,
      name: 'Moderate Democrats',
      description: 'Swing voters leaning moderate',
      count: 3100,
      filters_used: ['democrat', 'moderate'],
      demographics: {
        party_breakdown: { Democrat: 3100 },
        age_distribution: { '25-44': 1500, '45-64': 1600 },
        gender_split: { Male: 1500, Female: 1600 },
      },
      outreach_priority: 'High',
      recommended_channels: ['Phone', 'Mail'],
    },
  ],
  geographic_clusters: [
    { area: 'Downtown', voter_count: 5000, density_rank: 1 },
  ],
  methodology: 'L2 voter file analysis',
}

describe('VoterTargetingResults', () => {
  it('shows loading spinner', () => {
    mockUseArtifact.mockReturnValue({
      artifact: null,
      loading: true,
      error: null,
      retry: vi.fn(),
    })

    render(<VoterTargetingResults runId="run-1" />)

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

    render(<VoterTargetingResults runId="run-1" />)

    expect(screen.getByText('Failed to load report data.')).toBeInTheDocument()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await userEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('renders summary stats on success with formatted numbers', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<VoterTargetingResults runId="run-1" />)

    expect(screen.getByText('125,000')).toBeInTheDocument()
    expect(screen.getByText('18,500')).toBeInTheDocument()
  })

  it('renders segment tier badges', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<VoterTargetingResults runId="run-1" />)

    expect(screen.getByText('High-Propensity Independents')).toBeInTheDocument()
    expect(screen.getByText('Moderate Democrats')).toBeInTheDocument()
  })
})
