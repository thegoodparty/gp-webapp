import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { WalkingPlanResults } from './WalkingPlanResults'

vi.mock('../hooks/useArtifact')
import { useArtifact } from '../hooks/useArtifact'
const mockUseArtifact = vi.mocked(useArtifact)

const mockArtifact = {
  candidate_id: 'cand-1',
  candidate_name: 'Jane Doe',
  district: { state: 'OH', type: 'State House', name: 'District 42' },
  generated_at: '2026-03-30T12:00:00Z',
  summary: {
    total_areas: 5,
    total_doors: 12500,
    estimated_total_hours: 80,
    top_issues: ['Housing', 'Transit'],
  },
  areas: [
    {
      zip: '43201',
      city: 'Columbus',
      priority_rank: 1,
      door_count: 3200,
      estimated_minutes: 240,
      party_breakdown: { Independent: 1800, Democrat: 1400 },
      voters: [],
    },
    {
      name: 'Clintonville',
      zip: '43214',
      city: 'Columbus',
      priority_rank: 2,
      door_count: 2800,
      estimated_minutes: 200,
      party_breakdown: { Independent: 1500, Republican: 1300 },
      voters: [],
    },
  ],
  methodology: 'Geo-cluster analysis of voter file',
}

describe('WalkingPlanResults', () => {
  it('shows loading spinner', () => {
    mockUseArtifact.mockReturnValue({
      artifact: null,
      loading: true,
      error: null,
      retry: vi.fn(),
    })

    render(<WalkingPlanResults runId="run-1" />)

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

    render(<WalkingPlanResults runId="run-1" />)

    expect(screen.getByText('Failed to load report data.')).toBeInTheDocument()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await userEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('renders summary stats on success with formatted door count', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<WalkingPlanResults runId="run-1" />)

    expect(screen.getByText('12,500')).toBeInTheDocument()
    expect(screen.getByText('Total Doors')).toBeInTheDocument()
    expect(screen.getByText('Areas')).toBeInTheDocument()
    expect(screen.getByText('Est. Hours')).toBeInTheDocument()
  })

  it('renders area cards with door counts', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    const { container } = render(<WalkingPlanResults runId="run-1" />)

    const textContent = container.textContent ?? ''
    expect(textContent).toContain('3,200')
    expect(textContent).toContain('2,800')
    expect(textContent).toContain('43201')
    expect(textContent).toContain('Clintonville')
  })
})
