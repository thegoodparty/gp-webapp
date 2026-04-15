import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { MeetingBriefingArtifact } from '../types'
import { MeetingBriefingResults } from './MeetingBriefingResults'

vi.mock('../hooks/useArtifact')
import { useArtifact } from '../hooks/useArtifact'
const mockUseArtifact = vi.mocked(useArtifact)

vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div>{children}</div>,
}))

const mockArtifact: MeetingBriefingArtifact = {
  eo: {
    name: 'Jane Doe',
    city: 'Springfield',
    state: 'OH',
    office: 'City Council Member',
  },
  meeting: {
    body: 'Springfield City Council',
    date: '2026-04-15',
    time: '7:00 PM',
    agenda_source: 'https://example.com/agenda',
  },
  agenda_items: [
    {
      item_number: '1',
      title: 'Budget Approval',
      type: 'Resolution',
      requires_vote: true,
    },
  ],
  fiscal: {
    tax_rate: '2.5%',
    budget_total: '$45M',
    source: 'City Finance Office',
  },
  data_quality: {
    agenda: 'High',
    fiscal: 'Medium',
    platform: 'High',
    overall: 'High',
  },
  teaser_email: 'Preview of the upcoming council meeting.',
  briefing_content: '## Full Briefing\n\nDetailed analysis of all agenda items.',
  score: {
    total: 85,
    max: 100,
    recommendation: 'Attend',
    dimensions: [
      {
        id: 'relevance',
        name: 'Relevance',
        score: 90,
        justification: 'Directly impacts district',
      },
    ],
  },
  sources: [
    {
      id: 'src-1',
      type: 'government',
      title: 'City Agenda',
      url: 'https://example.com/agenda',
      accessed_at: '2026-03-30T12:00:00Z',
    },
  ],
  generated_at: '2026-03-30T12:00:00Z',
  based_on_district_intel_run: 'run-0',
}

describe('MeetingBriefingResults', () => {
  it('shows loading spinner', () => {
    mockUseArtifact.mockReturnValue({
      artifact: null,
      loading: true,
      error: null,
      retry: vi.fn(),
    })

    render(<MeetingBriefingResults runId="run-1" />)

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

    render(<MeetingBriefingResults runId="run-1" />)

    expect(screen.getByText('Failed to load report data.')).toBeInTheDocument()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await userEvent.click(retryButton)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  it('renders official name and meeting info on success', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<MeetingBriefingResults runId="run-1" />)

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
    expect(screen.getByText(/Springfield City Council/)).toBeInTheDocument()
  })

  it('renders recommendation badge on success', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<MeetingBriefingResults runId="run-1" />)

    expect(screen.getByText(/Attend/)).toBeInTheDocument()
  })

  it('defaults to Full Briefing tab', () => {
    mockUseArtifact.mockReturnValue({
      artifact: mockArtifact,
      loading: false,
      error: null,
      retry: vi.fn(),
    })

    render(<MeetingBriefingResults runId="run-1" />)

    expect(
      screen.getByText(/Detailed analysis of all agenda items/),
    ).toBeInTheDocument()
  })
})
