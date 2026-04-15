import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { PeerCityBenchmarkingArtifact } from '../types'
import { PeerCityBenchmarkingResults } from './PeerCityBenchmarkingResults'

vi.mock('../hooks/useArtifact')
import { useArtifact } from '../hooks/useArtifact'
const mockUseArtifact = vi.mocked(useArtifact)

const mockArtifact: PeerCityBenchmarkingArtifact = {
  official_name: 'Jane Doe',
  office: 'City Council Member',
  district: { state: 'OH', name: 'Ward 3' },
  generated_at: '2026-03-30T12:00:00Z',
  based_on_district_intel_run: 'run-0',
  summary: {
    home_city_population: 90000,
    peer_cities_analyzed: 3,
    issues_compared: 2,
    sources_consulted: 15,
  },
  home_city: {
    name: 'Springfield',
    state: 'OH',
    population: 90000,
  },
  peer_cities: [
    {
      name: 'Dayton',
      state: 'OH',
      population: 137000,
      similarity_reason: 'Similar size and demographics',
    },
    {
      name: 'Akron',
      state: 'OH',
      population: 190000,
      similarity_reason: 'Similar economic profile',
    },
    {
      name: 'Canton',
      state: 'OH',
      population: 70000,
      similarity_reason: 'Comparable transit challenges',
    },
  ],
  comparisons: [
    {
      issue: 'Road Infrastructure',
      home_city_approach: 'Incremental repairs',
      peer_approaches: [
        {
          city: 'Dayton',
          approach: 'Complete street rebuilds',
          outcome: 'Reduced complaints by 40%',
          budget: '$2M annually',
          timeline: '3-year plan',
          sources: [
            {
              id: 1,
              name: 'Dayton Report',
              url: 'https://example.com',
              date: '2026-01-01',
            },
          ],
        },
      ],
      takeaways: 'Consider larger-scale road projects',
    },
  ],
  methodology: 'Peer city analysis based on Census data',
}

describe('PeerCityBenchmarkingResults', () => {
  it('shows loading spinner', () => {
    mockUseArtifact.mockReturnValue({
      artifact: null,
      loading: true,
      error: null,
      retry: vi.fn(),
    })

    render(<PeerCityBenchmarkingResults runId="run-1" />)

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

    render(<PeerCityBenchmarkingResults runId="run-1" />)

    expect(screen.getByText('Failed to load report data.')).toBeInTheDocument()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await userEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('renders official name and district on success', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<PeerCityBenchmarkingResults runId="run-1" />)

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/Ward 3/)).toBeInTheDocument()
  })

  it('renders peer city cards on success', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<PeerCityBenchmarkingResults runId="run-1" />)

    expect(screen.getByText(/Dayton/)).toBeInTheDocument()
    expect(screen.getByText(/Akron/)).toBeInTheDocument()
    expect(screen.getByText(/Canton/)).toBeInTheDocument()
  })
})
